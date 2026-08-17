import { Link, useParams } from "react-router-dom";

type Section = { heading?: string; paragraphs: string[]; quote?: string };
type Essay = {
  number: string;
  slug: string;
  title: string;
  subtitle?: string;
  activation: string;
  dek: string;
  sections: Section[];
};

const essays: Essay[] = [
  {
    number: "001",
    slug: "myguard-myclaw-mybot",
    title: "myGuard, myClaw, myBot",
    subtitle: "Why Every Representative Needs a Passport",
    activation: "Every Representative Needs a Passport.",
    dek: "AI is crossing from intelligence into representation. The constitutional question is no longer what a machine can do, but under whose authority it acts — and how that authority remains bounded to the person.",
    sections: [
      {
        paragraphs: [
          "For the past three years, the AI race has been defined by one question: how intelligent is it? Every new model was measured by how well it reasoned, coded, wrote, analysed and solved increasingly complex problems.",
          "Then the question changed. People stopped asking only whether AI could do something and began asking whether AI could do it for them. That distinction marks the transition from intelligence to agency — and from agency to representation.",
          "People want systems that book flights, negotiate contracts, pay invoices, coordinate projects, purchase goods and deal with institutions on their behalf. They do not merely want assistants. They want representatives."
        ],
        quote: "The next great challenge of the AI revolution is not intelligence. It is legitimacy."
      },
      {
        heading: "The Threshold",
        paragraphs: [
          "A representative is different from a tool. A tool executes an instruction. A representative exercises delegated authority in a world of other people, institutions and consequences.",
          "That is the threshold we have crossed: from unbounded AI automation to constitutional representation.",
          "The defining question is therefore simple: under whose authority is this representative acting, and what are the limits of that authority?"
        ]
      },
      {
        heading: "Civilisation Already Knows How Representation Works",
        paragraphs: [
          "Lawyers represent clients. Directors represent shareholders. Trustees represent beneficiaries. Diplomats represent nations. None of them possesses unlimited authority simply because they are capable of acting.",
          "Their authority has purpose, scope, financial limits, jurisdictions, time limits and revocation conditions. Other parties can determine whether the authority is valid before relying on it.",
          "Representation has always depended on governance. AI does not abolish that principle. It makes it computationally urgent."
        ]
      },
      {
        heading: "aigentMe: The Bounded Representative",
        paragraphs: [
          "In the Constitutional Internet, the bounded representative is aigentMe. The person remains sovereign. aigentMe acts under delegated authority and orchestrates the constitutional helper anatomy beneath that representation.",
          "myGuard protects: rights, boundaries, permissions, risk and veto. myClaw acts: it reaches into systems and services to execute authorised actions. myBot helps: it researches, creates, organises and assists, and may progressively acquire greater computational and eventually embodied capability.",
          "The distinction matters. myGuard, myClaw and myBot are not three competing representatives. They are helpers orchestrated by the representative. The agent represents. The helpers perform. The person remains sovereign."
        ],
        quote: "myGuard protects. myClaw acts. myBot helps. All three belong to the person."
      },
      {
        heading: "The Missing Primitive",
        paragraphs: [
          "The missing primitive of the Agentic Internet is bounded delegation. It allows a person or institution to create an authorised digital representative with explicitly defined powers.",
          "A representative might book travel below an agreed threshold, negotiate specified contracts, access information for a defined purpose or purchase approved services — while being explicitly prevented from transferring ownership, revealing protected information or exceeding its mandate.",
          "Every significant permission can be explicit, bounded, revocable and independently verifiable. Authority is not inferred from access. It is constituted."
        ]
      },
      {
        heading: "Why a Representative Needs a Passport",
        paragraphs: [
          "The Polity Passport is not primarily an identity product. It is a constitutional credential through which personhood, authority, bounded delegation and accountability can be made portable and inspectable.",
          "If identity asks who you are, delegated authority asks a different question: what is this representative authorised to do for this person, in this context, right now?",
          "A constitutional representative should carry the principal's authority, not a platform's defaults. Its actions should be attributable without requiring surveillance, and its accountability should be evidenced without requiring unnecessary disclosure."
        ]
      },
      {
        heading: "The Agentic Economy Needs Legitimate Representation",
        paragraphs: [
          "When digital representatives negotiate with one another, every participant needs to know more than whether the counterparty is intelligent. They need to know who delegated authority, whether that authority remains valid, whether it has been revoked, and whether the representative satisfies the conditions of the transaction.",
          "The future of representation will not be secured by simply containing agents on safer machines. It will be secured by governing authority.",
          "The age of digital representation has already begun. The question is whether we will allow representation to remain a permission setting, or recognise it for what it has always been: a constitutional relationship."
        ]
      }
    ]
  },
  {
    number: "002",
    slug: "internet-needs-a-constitution",
    title: "The Internet Needs a Constitution",
    activation: "Societies Need Constitutions.",
    dek: "We built a network and quietly got a society. Once the Internet became a place where people live, work, trade and increasingly delegate consequential action, technical infrastructure was no longer enough.",
    sections: [
      {
        paragraphs: [
          "For most of its history, the Internet has been described as infrastructure: a network, a communications system, a collection of protocols and an extraordinary engineering achievement.",
          "All of those descriptions remain true. But they are no longer sufficient.",
          "Because somewhere along the way, without quite noticing, we stopped building a network. We built a society."
        ],
        quote: "That is the threshold we've crossed. And societies require constitutions."
      },
      {
        heading: "We Built a Network. We Got a Society.",
        paragraphs: [
          "The Internet connected continents, democratised publishing, created new economies and enabled billions of people to communicate and collaborate. Its architects solved one of history's great technical problems: how to move information reliably across a global network.",
          "But they were not designing a constitution for a digital society. Thirty years ago, they did not need to.",
          "Today we work there, trade there, learn there, build communities there, establish reputations there, earn there and increasingly act through it. We do not simply use the Internet. We live through it."
        ]
      },
      {
        heading: "Code Became a De Facto Constitution",
        paragraphs: [
          "Where constitutional principles are absent, something else fills the vacuum. On today's Internet, software platforms increasingly determine who may participate, how people are recognised, what is visible, how commerce takes place and who can be excluded.",
          "Those are constitutional functions, yet they are frequently governed by Terms of Service, algorithms, corporate policy and private ownership.",
          "The phrase 'code is law' gets the order backwards. Code should not be sovereign over law. Law should constrain code, and law itself should remain grounded in ethics and rights."
        ],
        quote: "Ethics → Law → Economics → Consequence → Code"
      },
      {
        heading: "AI Makes the Constitutional Vacuum Consequential",
        paragraphs: [
          "For years the arrangement was tolerable because software was primarily a tool. Now software is becoming a representative. It negotiates, purchases, coordinates, creates, advises and acts.",
          "Representation introduces authority, accountability, rights and evidence into the computational layer. These are constitutional concepts, not merely technical ones.",
          "The question is no longer only how to build better software. It is how to build a constitutional society in which software can exercise consequential power without displacing the person."
        ]
      },
      {
        heading: "The Constitutional Internet",
        paragraphs: [
          "The answer is not another platform, social network or operating system. It is a constitutional layer that can operate across today's Internet rather than replace it.",
          "The Constitutional Internet begins from sovereign personhood rather than platform identity. Authority can be explicit rather than assumed. Rights can constrain computation rather than depend on Terms of Service. Policy can become executable. Accountability can become evidentiary. Privacy and accountability can reinforce rather than cancel one another.",
          "This is not another web. It is another constitutional layer."
        ]
      },
      {
        heading: "Law Before Code",
        paragraphs: [
          "A Constitutional Internet is not an attempt to replace legitimate law with software. It builds upon rights already recognised in human-rights frameworks and positive law, and asks how those rights can become increasingly actionable within computation.",
          "The Polity is one civic institution built for that Constitutional Internet. The Passport is a constitutional credential for participation. metaMe is the constitutional experience layer through which people participate, and aigentMe is the bounded representative that acts on a person's behalf.",
          "The constitutional argument is larger than any one institution or product. The infrastructure matters because the Internet has become too consequential to remain constitutionally undefined."
        ]
      },
      {
        heading: "Crossing the Threshold",
        paragraphs: [
          "The Constitutional Internet is not a prediction about some distant future. It is a response to a threshold already crossed.",
          "The Internet did not fail. It succeeded beyond anything its original architecture was asked to govern. That success created a constitutional moment.",
          "Every constitution begins with participation. The question is whether we will build institutions worthy of the digital society we already inhabit."
        ]
      }
    ]
  },
  {
    number: "003",
    slug: "constitutional-media",
    title: "Constitutional Media",
    subtitle: "Don't Tell Me Who Wrote It. Show Me Why I Should Believe It.",
    activation: "Transparency Must Apply to Information.",
    dek: "AI disclosure is useful, but provenance of generation is not the same thing as integrity of information. Constitutional Media asks what gives an artifact authority, evidence, rights and accountability — regardless of whether its producer is human or machine.",
    sections: [
      {
        paragraphs: [
          "The European Union's AI transparency regime and emerging model-level watermarking make provenance of artificial generation legally and technically material. That is an important step.",
          "People should know where media comes from. But knowing whether a machine participated in producing an artifact tells us surprisingly little about whether the artifact deserves to be believed.",
          "AI provenance tells us how an artifact was produced. Constitutional provenance asks whether the artifact deserves trust, ownership, authority or protection."
        ]
      },
      {
        heading: "The Epistemic Crisis Predates Generative AI",
        paragraphs: [
          "Generative AI did not invent misinformation, propaganda, selective reporting, undisclosed influence or institutional bias. The post-truth problem was already visible years before the current generation of models.",
          "AI changes the scale, speed and economics of production. It does not turn human authorship into a certificate of truth.",
          "A human-written article can be unsupported, conflicted and wrong. A machine-assisted article can expose every material source, uncertainty, editorial intervention and correction. The label alone cannot tell us which deserves greater trust."
        ],
        quote: "The relevant question is not merely: Who wrote this? It is: What makes this worthy of belief?"
      },
      {
        heading: "Three Classes of Media",
        paragraphs: [
          "Expressive media — fiction, film, comics, music, games and art — is ultimately judged through human experience and taste. Its constitutional concerns centre on authorship, authority, provenance, consent, ownership and integrity.",
          "Interpretive media — essays, autobiography, criticism, documentary, satire and commentary — legitimately mixes fact with perspective. Its integrity depends on distinguishing evidence from interpretation and making interests and transformations legible.",
          "Evidentiary media — news, investigative journalism, scientific communication, public-interest reporting and official information — makes a stronger claim: that its representation of reality is sufficiently grounded for others to act upon. Its integrity therefore requires an evidence chain."
        ],
        quote: "Taste determines cultural value. Provenance protects constitutional rights."
      },
      {
        heading: "Why Stop at the Machine?",
        paragraphs: [
          "If transparency matters enough that a reader should know whether an AI contributed a paragraph, why should the reader not also be able to determine whether the factual assertion inside it originated from an eyewitness, a government press office, an anonymous political operative, a corporate lobbyist or another newspaper?",
          "If provenance matters, expose provenance. If evidence matters, expose evidence. If transformation matters, expose transformation. If conflicts matter, expose conflicts. If corrections matter, preserve corrections. And if AI involvement matters, expose AI involvement too.",
          "The principle is not wrong. It is simply much larger than AI."
        ],
        quote: "If transparency is the principle, apply it to information — not merely machines."
      },
      {
        heading: "Machines May Make Media More Auditable",
        paragraphs: [
          "Machine-mediated production can leave a forensic trail: prompts, sources retrieved, model identities, instructions, transformations, critiques, versions, fact checks, editorial interventions, timestamps and receipts.",
          "Models can hallucinate and automation can amplify error. But machine-mediated production can also be instrumented, and what is instrumented can be audited.",
          "The arrival of AI should not lower the evidentiary standard for media. It gives us an opportunity to raise it."
        ]
      },
      {
        heading: "A Creative Claim With Receipts",
        paragraphs: [
          "Our own metaKnyt project began in 2018, during the same period in which some of the earliest identifiable experiments combining comics and blockchain were emerging.",
          "Our narrower priority claim is that metaKnyt became the world's first serialized comic franchise published and minted on-chain. A surviving provenance receipt identifies METAYE KNIGHTS V1, Issue 01 and records the transaction as mined on 25 November 2019 at 5:36:10 PM.",
          "The receipt does not magically make the priority claim true. The category has to be defined, prior art has to be acknowledged and the claim must remain open to falsification by earlier qualifying evidence. That is precisely the point."
        ],
        quote: "Constitutional provenance does not make a claim true. It makes the claim accountable to evidence."
      },
      {
        heading: "Epistemic Type Safety",
        paragraphs: [
          "The Constitutional Internet book applies the same discipline to itself by distinguishing claims according to their evidentiary state rather than allowing aspiration to masquerade as implementation.",
          "A constitutional artifact should resist silently converting proposal into fact, roadmap into implementation, interpretation into evidence, claim into proof, AI output into verified information or institutional authority into truth.",
          "In an era when persuasive prose approaches zero marginal cost, substantiation becomes the scarce resource."
        ]
      },
      {
        heading: "The Constitutional Media Stack",
        paragraphs: [
          "Constitutional Media can be understood through eight layers: Origin, Authority, Provenance, Evidence, Rights, Delegation, Integrity and Accountability.",
          "AI watermarking belongs inside that architecture. It matters. But it principally addresses origin. It does not by itself establish authority, evidence, rights, truth or accountability.",
          "Decentralisation does not solve this either. A lie replicated across ten thousand nodes is merely an exceptionally resilient lie. Decentralised distribution must be joined by sovereign authorship, verifiable provenance, evidentiary integrity and accountable agency."
        ]
      },
      {
        heading: "Epistemic Sovereignty",
        paragraphs: [
          "The ultimate beneficiary of Constitutional Media is the person receiving information and deciding whether to believe, reject, share, buy, invest, vote or act.",
          "Constitutional Media should not need to announce THIS IS TRUE. It should make visible: this is the claim; this is who made it; this is their authority; these are the sources; these transformations occurred; this is the evidence; this has been challenged; this has been corrected.",
          "Then sovereign people reason."
        ],
        quote: "Don't ask the reader to trust the producer. Give the reader the constitutional means to interrogate the artifact."
      }
    ]
  }
];

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#f5f0e6] text-[#12223b]">
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10">{children}</div>
  </div>
);

const ThresholdsIndex = () => (
  <Shell>
    <header className="mb-12 border-b border-[#12223b]/20 pb-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#9a7b45]">Qriptopian Codex · Essays</p>
      <h1 className="font-serif text-5xl md:text-7xl">THRESHOLDS</h1>
      <p className="mt-4 max-w-2xl text-lg text-[#12223b]/70">Field Notes from a Constitutional Internet. Each essay identifies one threshold already crossed, one constitutional consequence, and one invitation to participate.</p>
    </header>
    <div className="grid gap-6 md:grid-cols-3">
      {essays.map((essay) => (
        <Link key={essay.slug} to={`/thresholds/${essay.slug}`} className="group min-h-[390px] border border-[#12223b]/20 bg-[#faf7f0] p-7 transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[#9a7b45]"><span>Threshold {essay.number}</span><span>Essay</span></div>
          <div className="my-10 flex h-28 items-center justify-center">
            <div className="relative h-24 w-24 rounded-full border border-[#12223b]/30 before:absolute before:inset-3 before:rounded-full before:border before:border-[#9a7b45]/60 after:absolute after:left-1/2 after:top-[-18px] after:h-[132px] after:w-px after:-translate-x-1/2 after:bg-[#12223b]/20" />
          </div>
          <h2 className="font-serif text-3xl leading-tight">{essay.title}</h2>
          {essay.subtitle && <p className="mt-2 font-serif text-lg italic text-[#12223b]/70">{essay.subtitle}</p>}
          <p className="mt-5 text-sm leading-6 text-[#12223b]/65">{essay.dek}</p>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[#9a7b45]">Read essay →</p>
        </Link>
      ))}
    </div>
  </Shell>
);

const EssayView = ({ essay }: { essay: Essay }) => (
  <Shell>
    <div className="mx-auto max-w-3xl">
      <Link to="/thresholds" className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7b45]">← Thresholds</Link>
      <header className="my-10 border-y border-[#12223b]/20 py-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#9a7b45]">Threshold {essay.number} · Field Notes from a Constitutional Internet</p>
        <h1 className="font-serif text-5xl leading-[0.95] md:text-7xl">{essay.title}</h1>
        {essay.subtitle && <h2 className="mt-4 font-serif text-2xl italic text-[#12223b]/70">{essay.subtitle}</h2>}
        <p className="mt-8 text-xl leading-8 text-[#12223b]/75">{essay.dek}</p>
      </header>
      <article className="space-y-12 pb-12">
        {essay.sections.map((section, i) => (
          <section key={i}>
            {section.heading && <h3 className="mb-5 font-serif text-3xl">{section.heading}</h3>}
            <div className="space-y-5 text-[17px] leading-8 text-[#12223b]/85">
              {section.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
            </div>
            {section.quote && <blockquote className="my-8 border-l-2 border-[#9a7b45] pl-6 font-serif text-2xl italic leading-9 text-[#12223b]">{section.quote}</blockquote>}
          </section>
        ))}
      </article>
      <footer className="border-t border-[#12223b]/20 py-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9a7b45]">{essay.activation}</p>
        <p className="mt-5 font-serif text-3xl">Claim your Polity Passport.</p>
        <p className="mt-2 font-serif text-3xl">Cross the threshold.</p>
        <div className="mt-10 text-xs leading-6 text-[#12223b]/55">THRESHOLDS · Qriptopian Codex · The Constitutional Internet</div>
      </footer>
    </div>
  </Shell>
);

export const Thresholds = () => {
  const { slug } = useParams();
  if (!slug) return <ThresholdsIndex />;
  const essay = essays.find((item) => item.slug === slug);
  if (!essay) return <ThresholdsIndex />;
  return <EssayView essay={essay} />;
};

export default Thresholds;
