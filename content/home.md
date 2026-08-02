---
title: Home
brand: "[make]new"
tagline: "church for people who don't like church"
heroImage: /images/hero-poster.svg
showHeroVideo: false
aboutTitle: "What we're about"
aboutIntro: >
  [make]new is church for people who don't like church. Built around college
  life in the Triangle. Open 24/7.
# FART is the "how we reach people" layer of the About page. Its four cards
# intentionally absorbed the old standalone "Intellectual rigor" pillar (now
# folded into Reason, below) so the page stops repeating itself — see
# decisions/2026-08-02-about-page-fart-rework.md.
differentiator:
  title: "Come FART with us"
  acronym: FART
  # Context copy shown once, above the four cards. Rendered as separate
  # paragraphs by src/pages/what-were-about.astro (split on blank lines).
  intro: |
    Yes, we know it's immature. But we have your attention now, don't we?

    Despite what the title might suggest, we're not actually interested in your ability to flatulate. FART is an easy-to-remember acronym for the four things that shape everything we do — the stuff that makes us distinctly [make]new.
  items:
    - letter: F
      word: Faith
      summary: The gospel is the basis of everything we do.
      body: >
        Okay, this one isn't revolutionary — we believe the gospel is the
        foundation for everything we do. It's not one item on a list;
        everything else flows from it.
    - letter: A
      word: Art
      summary: Creativity that speaks to the human experience.
      body: >
        Art — film, music, literature, any form of creative expression —
        shapes people's values and speaks to something past rote reason: the
        human experience itself, in ways words alone can't always capture.
        That's why we engage with art from all kinds of artists, most of them
        not Christian, as a way to share the gospel. On any given Friday,
        expect skits, music, and film that connect the human experience to
        the Christian worldview.
    - letter: R
      word: Reason
      summary: College-level seriousness about faith questions.
      # Contains inline HTML (rendered via set:html in what-were-about.astro):
      # an <abbr> definition tooltip for "apologetics" and a link to /christian-themes-for-privileged-teens (CTPT),
      # so the Reason claim is backed by something concrete instead of just asserted.
      body: >
        College is when a lot of people start asking the big questions for
        the first time, and "just believe" isn't a good enough answer. We
        think faith should hold up to scrutiny, so we dig into the hard
        stuff — the problem of suffering, the historicity of the Bible,
        whether a fine-tuned universe points to a Creator. That's
        <abbr title="Apologetics: giving reasoned answers in defense of the Christian faith.">apologetics</abbr>
        in practice, and it's why we built
        <a href="/christian-themes-for-privileged-teens">CTPT</a>, our free
        series working through Christianity's toughest questions.
    - letter: T
      word: Technology
      summary: Tech-forward, and paying attention to right now.
      body: >
        We're constantly experimenting with new technology in our Friday
        productions — from the tools on stage to how we tell a story. That
        same curiosity extends to current events, because the gospel isn't
        just for people in ancient Judea. It has something to say about
        today, too.
characteristics:
  - id: tagline
    phrase: "is a church for people who don't like church"
    holdMs: 7000
    aboutAnchor: intro
  - id: mobility
    phrase: "meets in a dance studio (721 Broad St)"
    holdMs: 4000
    aboutAnchor: mobility
    footnote: >
      Sundays and Fridays if you're around Duke. NC State and UNC will have
      their own locations. Check Instagram for the most up-to-date week-to-week
      schedule.
  - id: rigor
    phrase: "approaches Christianity with college-level rigor"
    holdMs: 4000
    # Points at the FART "Reason" card, not a standalone pillar — see the
    # differentiator.items note above on why Intellectual rigor was folded in.
    aboutAnchor: fart-reason
  - id: always-on
    phrase: "is open 24/7"
    holdMs: 4000
    aboutAnchor: always-on
  - id: gospel
    phrase: "shares the gospel"
    holdMs: 4000
    aboutAnchor: sharing-the-gospel
pillars:
  - title: Mobility
    slug: mobility
    summary: Meeting in a dance studio — or really anywhere.
    body: >
      We've met in Airbnbs, dorms, and outdoors. Our church isn't a set
      address (except for tax purposes) but a community of God's people
      worshipping together. A more practical reason for meeting in a dance
      studio? Owning a building is expensive.
  - title: Living life together
    slug: living-life-together
    summary: The Gospel has real implications for how we live.
    body: >
      One of the clearest pictures in the early church was selling possessions,
      providing for one another, and living in community. We don't think
      anything has changed.
  - title: Sharing the Gospel
    slug: sharing-the-gospel
    summary: Life-saving news worth sharing.
    body: >
      If you had life-saving news, wouldn't you share it too?
cta:
  heading: "I'm sold. What's next?"
  text: Come visit us — see Locations for times and campuses.
  link: /locations
---
