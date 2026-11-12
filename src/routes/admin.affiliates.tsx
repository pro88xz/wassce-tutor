import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { EmptyState, Pill } from '@/components/ds/Primitives'

// Admin · Affiliates: approve affiliates, review first-payment commissions and
// settle payout requests. The admin layout (admin.tsx) has already checked
// that the user is an admin with an unlocked session.
export const Route = createFileRoute('/admin/affiliates')({
  component: AdminAffiliates,
})

type Tab = 'affiliates' | 'commissions' | 'payouts'
type Affiliate = { id: string; user_id: string; code: string; status: string; created_at: string; approved_at: string | null }
type Commission = { id: string; affiliate_id: string; referred_user_id: string; gross_amount_nle: number; commission_amount_nle: number; status: string; created_at: string }
type Payout = { id: string; affiliate_id: string; amount_nle: number; payout_method: string; payout_account_name: string; payout_account_number: string; status: string; requested_at: string; admin_note: string | null }

const METHOD: Record<string, string> = { orange_money: 'Orange Money', afrimoney: 'Afrimoney', bank: 'Bank transfer' }
const nle = (n: number) => `NLe ${Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const day = (v: string) => new Date(v).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function AdminAffiliates() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>('affiliates')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const data = useQuery({
    queryKey: ['admin-affiliates'],
    queryFn: async () => {
      const [a, c, p] = await Promise.all([
        supabase.from('affiliates').select('id,user_id,code,status,created_at,approved_at').order('created_at', { ascending: false }),
        supabase.from('affiliate_commissions').select('id,affiliate_id,referred_user_id,gross_amount_nle,commission_amount_nle,status,created_at').order('created_at', { ascending: false }).limit(300),
        supabase.from('affiliate_payout_requests').select('id,affiliate_id,amount_nle,payout_method,payout_account_name,payout_account_number,status,requested_at,admin_note').order('requested_at', { ascending: false }).limit(300),
      ])
      if (a.error) throw a.error
      if (c.error) throw c.error
      if (p.error) throw p.error
      const affiliates = (a.data ?? []) as Affiliate[]
      const commissions = (c.data ?? []) as Commission[]
      const ids = [...new Set([...affiliates.map((x) => x.user_id), ...commissions.map((x) => x.referred_user_id)])]
      const names: Record<string, string> = {}
      if (ids.length) {
        const { data: people } = await supabase.from('profiles').select('id,full_name').in('id', ids)
        for (const person of people ?? []) names[person.id] = person.full_name ?? ''
      }
      return { affiliates, commissions, payouts: (p.data ?? []) as Payout[], names }
    },
  })

  const act = async (label: string, fn: () => Promise<void>) => {
    setBusy(true); setError(null); setMessage(null)
    try {
      await fn(); setMessage(label)
      await Promise.all([qc.invalidateQueries({ queryKey: ['admin-affiliates'] }), qc.invalidateQueries({ queryKey: ['admin-pending-counts'] })])
    } catch (err) { setError(err instanceof Error ? err.message : String((err as { message?: string })?.message ?? err)) } finally { setBusy(false) }
  }
  const email = (entity: string, event: string) => supabase.functions.invoke('send-notification-email', { body: { entity_id: entity, event_type: event } }).catch(() => undefined)

  const reviewAffiliate = (a: Affiliate, decision: 'approved' | 'suspended') => act(decision === 'approved' ? 'Affiliate approved. Their referral link is now active.' : 'Affiliate paused. Their code no longer attributes new sign-ups.', async () => {
    const { error } = await supabase.rpc('review_affiliate', { p_affiliate_id: a.id, p_decision: decision })
    if (error) throw error
    await email(a.id, `affiliate_${decision}`)
  })
  const reviewCommission = (c: Commission, decision: 'approved' | 'reversed') => act(decision === 'approved' ? 'Commission approved and added to the affiliate’s withdrawable balance.' : 'Commission reversed.', async () => {
    const { error } = await supabase.rpc('review_affiliate_commission', { p_commission_id: c.id, p_decision: decision })
    if (error) throw error
    await email(c.id, `commission_${decision}`)
  })
  const reviewPayout = (p: Payout, decision: 'processing' | 'paid' | 'rejected') => act(`Payout marked ${decision}.`, async () => {
    const { error } = await supabase.rpc('review_affiliate_payout', { p_payout_id: p.id, p_decision: decision, p_note: null })
    if (error) throw error
    await email(p.id, `payout_${decision}`)
  })

  const d = data.data
  const byId = new Map((d?.affiliates ?? []).map((a) => [a.id, a]))
  const affiliateName = (affiliateId: string) => {
    const a = byId.get(affiliateId)
    return a ? `${d?.names[a.user_id] || 'Affiliate'} (${a.code})` : 'Affiliate'
  }
  const pendingAffiliates = (d?.affiliates ?? []).filter((a) => a.status === 'pending')
  const pendingCommissions = (d?.commissions ?? []).filter((c) => c.status === 'pending')
  const openPayouts = (d?.payouts ?? []).filter((p) => p.status === 'requested' || p.status === 'processing')

  const tabs: [Tab, string][] = [
    ['affiliates', `Affiliates (${pendingAffiliates.length} waiting)`],
    ['commissions', `Commissions (${pendingCommissions.length} to review)`],
    ['payouts', `Payouts (${openPayouts.length} open)`],
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-bold">Affiliates</h1>
        </div>
        <Link to="/admin"><Button variant="outline" size="sm">Back</Button></Link>
      </div>
      <p className="text-sm text-muted-foreground">Approved affiliates earn 50% of a referred student’s first verified subscription payment. Commissions are created automatically when that payment completes; approve them here before they can be withdrawn.</p>

      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`min-h-10 rounded-full border px-4 text-sm font-semibold ${tab === id ? 'border-primary bg-brand-soft text-primary' : 'bg-card'}`}>{label}</button>
        ))}
      </div>

      {message && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {data.isLoading ? <p className="text-muted-foreground">Loading…</p> : data.error ? <EmptyState title="Could not load affiliates" body={(data.error as Error).message} /> : d && (
        <>
          {tab === 'affiliates' && (d.affiliates.length === 0 ? <EmptyState title="No affiliates yet" body="People apply from the affiliate dashboard; applications appear here and you get an email alert." /> : (
            <ul className="space-y-3">{d.affiliates.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
                <div>
                  <p className="font-bold">{d.names[a.user_id] || 'Unnamed account'}</p>
                  <p className="text-xs text-muted-foreground">Code {a.code} · applied {day(a.created_at)}{a.approved_at ? ` · approved ${day(a.approved_at)}` : ''}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill className={a.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : a.status === 'pending' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-700'}>{a.status === 'approved' ? 'Active' : a.status === 'pending' ? 'Waiting' : 'Paused'}</Pill>
                  {a.status !== 'approved' && <Button size="sm" disabled={busy} onClick={() => void reviewAffiliate(a, 'approved')} className="bg-emerald-700 hover:bg-emerald-800">Approve</Button>}
                  {a.status !== 'suspended' && <Button size="sm" variant="outline" disabled={busy} onClick={() => void reviewAffiliate(a, 'suspended')} className="border-red-200 text-red-700">{a.status === 'pending' ? 'Decline' : 'Pause'}</Button>}
                </div>
              </li>
            ))}</ul>
          ))}

          {tab === 'commissions' && (d.commissions.length === 0 ? <EmptyState title="No commissions yet" body="A commission appears when a referred student completes their first payment." /> : (
            <ul className="space-y-3">{d.commissions.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
                <div>
                  <p className="font-bold">{nle(c.commission_amount_nle)} <span className="font-normal text-muted-foreground">· 50% of {nle(c.gross_amount_nle)}</span></p>
                  <p className="text-xs text-muted-foreground">{affiliateName(c.affiliate_id)} · referred {d.names[c.referred_user_id] || 'student'} · {day(c.created_at)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Pill>{c.status}</Pill>
                  {c.status === 'pending' && <>
                    <Button size="sm" disabled={busy} onClick={() => void reviewCommission(c, 'approved')} className="bg-emerald-700 hover:bg-emerald-800">Approve</Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void reviewCommission(c, 'reversed')} className="border-red-200 text-red-700">Reverse</Button>
                  </>}
                </div>
              </li>
            ))}</ul>
          ))}

          {tab === 'payouts' && (d.payouts.length === 0 ? <EmptyState title="No payout requests" body="Affiliates request their full approved balance (minimum NLe 50) from their dashboard." /> : (
            <ul className="space-y-3">{d.payouts.map((p) => (
              <li key={p.id} className="space-y-2 rounded-2xl border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{nle(p.amount_nle)} · {METHOD[p.payout_method] ?? p.payout_method}</p>
                    <p className="text-xs text-muted-foreground">{affiliateName(p.affiliate_id)} · requested {day(p.requested_at)}</p>
                    <p className="mt-1 text-sm">Pay to <span className="font-semibold">{p.payout_account_name}</span> · {p.payout_account_number}</p>
                  </div>
                  <Pill className={p.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : p.status === 'rejected' ? 'bg-muted text-muted-foreground' : 'bg-amber-50 text-amber-800'}>{p.status}</Pill>
                </div>
                {(p.status === 'requested' || p.status === 'processing') && (
                  <div className="flex flex-wrap gap-2">
                    {p.status === 'requested' && <Button size="sm" variant="outline" disabled={busy} onClick={() => void reviewPayout(p, 'processing')}>Mark processing</Button>}
                    <Button size="sm" disabled={busy} onClick={() => void reviewPayout(p, 'paid')} className="bg-emerald-700 hover:bg-emerald-800">Mark paid</Button>
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => void reviewPayout(p, 'rejected')} className="border-red-200 text-red-700">Reject (returns balance)</Button>
                  </div>
                )}
              </li>
            ))}</ul>
          ))}
        </>
      )}
    </div>
  )
}
