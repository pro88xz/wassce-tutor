:::callout{type=definition}
A **computer network** is two or more computers and other devices linked together, by cables or by wireless signals, so that they can communicate and share data, files, printers and an Internet connection.
:::

A school computer laboratory where every machine prints to one printer, a bank whose branches all see the same accounts, and your phone paired with wireless earphones are all **networks**. This lesson explains the **types of computer networks** (PAN, LAN, MAN and WAN), **network topologies** (bus, star, ring and mesh), **network devices and their functions**, **transmission media**, client-server and peer-to-peer networks, the modes of data transmission, and the advantages and disadvantages of networking.

## Learning objectives

By the end of this lesson you should be able to:

- define a computer network and state the advantages and disadvantages of networking
- describe PAN, LAN, MAN and WAN, with examples
- draw and describe the bus, star, ring and mesh topologies, with an advantage and a disadvantage of each
- state the function of a network interface card, hub, switch, router, modem, access point, repeater, bridge and gateway
- compare twisted-pair, coaxial and fibre-optic cables and wireless media
- distinguish client-server from peer-to-peer networks, and simplex, half-duplex and full-duplex transmission

## Types of networks by area

![Types of networks drawn as nested areas: a personal area network (PAN) covers a few metres, such as a phone and Bluetooth earphones; a local area network (LAN) covers one building or site, such as a school computer lab; a metropolitan area network (MAN) covers a town or city, such as campuses across Freetown; a wide area network (WAN) covers countries and continents, such as the Internet or a bank's branches](https://wasscetutor.com/img/ict/types-of-networks.svg)

*Figure 1. Networks grouped by the area they cover, from PAN to WAN. WASSCE Tutor diagram.*

:::callout{type=definition}
**Personal area network (PAN):** a network of devices within a few metres of one person, such as a phone linked to a smartwatch or earphones.

**Local area network (LAN):** a network that covers a small area such as one room, building or school compound, usually owned by one organisation.

**Metropolitan area network (MAN):** a network that covers a town or a city, linking several LANs, such as the sites of one university across a city.

**Wide area network (WAN):** a network that covers a large area, such as a country or several continents, often using telephone lines, undersea cables and satellites.
:::

| | LAN | MAN | WAN |
|---|---|---|---|
| Area | a building or site | a town or city | a country or the world |
| Ownership | usually one organisation | one organisation or a city | many organisations |
| Speed | fast | fairly fast | slower over long distances |
| Cost | low | medium | high |
| Example | a school computer lab | a university's campuses | the Internet, a bank's branches |

## Network topologies

:::callout{type=definition}
**Network topology:** the physical or logical arrangement of the devices (nodes) and links in a network.

**Node:** any device connected to a network, such as a computer, printer or phone.
:::

![Four network topologies: bus, where every computer joins one backbone cable with a terminator at each end; star, where every computer has its own cable to a central switch; ring, where each computer joins the next in a closed loop and data passes round in one direction; and mesh, where every computer is linked to every other](https://wasscetutor.com/img/ict/network-topologies.svg)

*Figure 2. The bus, star, ring and mesh topologies. WASSCE Tutor diagram.*

| Topology | Advantages | Disadvantages |
|---|---|---|
| **Bus**: all nodes share one main cable (the backbone) | cheap; uses the least cable; easy to add a node | a break in the backbone stops the whole network; slows down as traffic grows; faults are hard to find |
| **Star**: every node has its own cable to a central switch or hub | a broken cable affects only one node; easy to add nodes and find faults; fast | needs more cable; if the central switch fails, the whole network stops |
| **Ring**: each node joins the next in a closed loop | data flows in one direction, so there are no collisions; works well under heavy traffic | one broken node or cable can stop the ring; adding a node interrupts the network |
| **Mesh**: nodes are joined to many or all other nodes | many routes, so it keeps working if a link fails; very reliable | a lot of cable and cost; hard to set up |

A **tree (hybrid) topology** joins several star networks to a main backbone, as in a school where each block has its own switch. The **star** is the most common topology in LANs today.

## Network devices

![A small network: three desktop computers and a shared printer are cabled to a switch; a wireless access point, cabled to the switch, gives Wi-Fi to a laptop and a phone; the switch connects to a router with a firewall, the router to a modem or fibre box, the modem to the Internet service provider, and the ISP to the Internet](https://wasscetutor.com/img/ict/small-office-network.svg)

*Figure 3. The devices in a small office or school network. WASSCE Tutor diagram.*

:::callout{type=definition}
**Network interface card (NIC):** the circuit, built in or added, that connects a device to a network; each has a unique hardware address called a MAC address.

**Hub:** a simple central device that receives data and sends it out to every connected device.

**Switch:** a central device that receives data and sends it only to the device it is addressed to, so a switched network is faster and more private than one built on a hub.

**Router:** a device that connects different networks, such as a LAN and the Internet, and chooses the path for data to travel between them.

**Modem:** short for modulator-demodulator, a device that converts a computer's digital signals into signals that can travel over a telephone, cable or mobile line, and back again.

**Wireless access point:** a device that lets wireless devices such as laptops and phones join a wired network by Wi-Fi.

**Repeater:** a device that boosts (regenerates) a weakening signal so it can travel further.

**Gateway:** a device or program that connects two networks that use different rules (protocols), translating between them.
:::

A **bridge** joins two parts (segments) of a LAN so they act as one network. In homes and small offices one box often combines a modem, router, switch and access point.

## Transmission media

:::callout{type=definition}
**Transmission medium:** the path along which data travels between devices in a network: a cable (wired, or guided, media) or radio, microwave or infrared signals (wireless, or unguided, media).

**Bandwidth:** the amount of data a connection can carry each second, measured in bits per second, such as megabits per second (Mbps).
:::

| Medium | How it carries data | Features | Typical use |
|---|---|---|---|
| **Twisted-pair cable** | electrical signals on pairs of twisted copper wires | cheap, easy to fit; up to about 100 m; affected by electrical interference | LANs (Ethernet cables with RJ-45 plugs), telephone lines |
| **Coaxial cable** | electrical signals on a copper core inside a metal shield | better shielded than twisted pair | cable TV, older networks |
| **Fibre-optic cable** | pulses of **light** along thin glass fibres | very fast, carries data over long distances, not affected by electrical interference; costly and delicate | Internet backbones, undersea cables, links between buildings |
| **Radio waves** | wireless signals | no cables; signals pass through walls | Wi-Fi, mobile networks |
| **Microwaves** | line-of-sight wireless beams between dishes on towers | long distances without cables | links between mobile phone masts |
| **Satellite** | signals sent up to a satellite and back down | covers remote areas | TV, Internet in remote places |
| **Infrared** | invisible light over a short, clear path | very short range | TV remote controls |

## Client-server and peer-to-peer networks

![Client-server and peer-to-peer networks: in client-server, a central server holds files, security and backups and three client computers ask it for services; in peer-to-peer, four equal computers are all linked and share with each other directly](https://wasscetutor.com/img/ict/client-server-vs-peer-to-peer.svg)

*Figure 4. A client-server network and a peer-to-peer network. WASSCE Tutor diagram.*

:::callout{type=definition}
**Server:** a powerful computer that provides a service, such as storing shared files, running email or holding a website, to other computers on a network.

**Client-server network:** a network in which client computers request files and services from one or more central servers that control the network.

**Peer-to-peer network:** a network with no central server, in which every computer is equal and shares its own files and printers directly with the others.
:::

| Client-server | Peer-to-peer |
|---|---|
| central server controls security and backups | each user controls their own computer |
| suits large networks | suits small networks of a few computers |
| costly: needs a server and a network manager | cheap and easy to set up |
| if the server fails, services stop | no single point of failure, but harder to manage |

## Modes of data transmission

:::callout{type=definition}
**Protocol:** an agreed set of rules for how data is formatted, sent and received over a network, such as TCP/IP, the protocols of the Internet.
:::

| Mode | Direction of data | Example |
|---|---|---|
| **Simplex** | one direction only | radio and TV broadcasting; keyboard to computer |
| **Half-duplex** | both directions, but **one at a time** | walkie-talkie: one person speaks, then the other |
| **Full-duplex** | both directions **at the same time** | a telephone call; a mobile data connection |

## Advantages and disadvantages of networking

**Advantages:** files and data are **shared**; one printer or Internet connection **serves many users**; users **communicate** by email and messaging; data is **backed up centrally**; software can be installed and updated across the network; security can be **controlled centrally**.

**Disadvantages:** **cost** of cables, devices and skilled staff; viruses and attacks can **spread** quickly to every computer; a failure of a key device (server or switch) can **stop everyone's work**; there is a risk of **unauthorised access** to data.

:::callout{type=local-example}
**A school network.** A computer laboratory in Makeni has 30 computers cabled in a **star** to a switch, a laser printer they all share, and a **router** connected to a mobile operator's 4G modem, so every student can browse the Internet through one connection. The school's laboratory is a **LAN**; the operator's network that links it to the world is part of a **WAN**.
:::

:::callout{type=common-mistake}
**Treating a hub and a switch as the same thing.** Both are central devices, but a **hub** sends every message to **all** devices, while a **switch** sends each message only to the device it is for.
:::

## Practice

:::reveal{title="1. Define a computer network and give two advantages of networking."}
Two or more computers and devices **linked to communicate and share resources**. Advantages (any two): sharing **files** and **printers**; one **Internet connection** for many; **communication**; central **backup** and **security**.
:::

:::reveal{title="2. State two differences between a LAN and a WAN."}
Any two: a LAN covers a **small area** (a building), a WAN a **large area** (countries); a LAN is usually owned by **one organisation**, a WAN by many; a LAN is **faster** and **cheaper**; example: a school lab (LAN) and the Internet (WAN).
:::

:::reveal{title="3. Give one advantage and one disadvantage of the star topology."}
Advantage: a **broken cable affects only one computer**, and faults are easy to find. Disadvantage: if the **central switch fails**, the whole network stops; it also needs **more cable** than a bus.
:::

:::reveal{title="4. State the function of (a) a router, (b) a modem, (c) a repeater."}
(a) Connects **different networks** and chooses the path for data between them. (b) **Converts digital signals** to signals that can travel over a telephone, cable or mobile line, and back. (c) **Boosts a weak signal** so it can travel further.
:::

:::reveal{title="5. Distinguish between half-duplex and full-duplex transmission, with an example of each."}
**Half-duplex**: data goes both ways but **one way at a time**, as with a walkie-talkie. **Full-duplex**: data goes both ways **at the same time**, as in a telephone call.
:::

## Key points

- A **network** links devices to share data and resources. By area: **PAN, LAN, MAN, WAN** (the Internet is the largest WAN).
- **Topologies**: **bus** (one backbone), **star** (central switch; most common), **ring** (closed loop), **mesh** (many links).
- Devices: **NIC, hub, switch, router, modem, access point, repeater, bridge, gateway**.
- Media: **twisted pair, coaxial, fibre-optic** (light; fastest) and **wireless** (radio, microwave, satellite, infrared).
- **Client-server** (central server) and **peer-to-peer** (all equal) networks.
- Transmission: **simplex** (one way), **half-duplex** (both ways, one at a time), **full-duplex** (both ways at once).

## WASSCE examination focus

:::callout{type=waec-tests}
Networking questions ask you to define a network and state its advantages, to compare LAN, MAN and WAN, to draw and label the bus, star and ring topologies and give an advantage and disadvantage of each, to state the functions of network devices such as the router, switch, hub and modem, and to name transmission media. A topology drawing should show every computer, every link and the central device or backbone, clearly labelled.
:::
