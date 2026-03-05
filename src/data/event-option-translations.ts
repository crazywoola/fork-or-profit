export type EventOptionTranslation = {
  label: string
  description: string
}

export const EVENT_OPTION_TRANSLATIONS: Record<string, EventOptionTranslation[]> = {
  'github-stars-explosion': [
    { label: 'Publish a follow-up blog post', description: 'Ride the traffic wave with fresh content.' },
    { label: 'Quickly clear the issue backlog', description: 'Show strong responsiveness to the community.' },
    { label: 'Launch sponsorship channels', description: 'Monetize the momentum, but some users may dislike it.' },
  ],
  'hacker-news-front-page': [
    { label: 'Engage actively in comments', description: 'Positive interaction can improve trust.' },
    { label: 'Lean into controversy', description: 'Criticism may still increase visibility.' },
  ],
  'cloud-vendor-fork': [
    { label: 'Re-license under BSL/SSPL', description: 'Community split; may trigger Licensing Controversy.' },
    { label: 'Negotiate with the cloud vendor', description: 'Trade control for commercial upside.' },
    { label: 'Double down on a community moat', description: 'Sacrifice short-term business to win community support.' },
  ],
  'major-security-vulnerability': [
    { label: '72-hour hotfix + public post-mortem', description: 'Transparency helps rebuild trust.' },
    { label: 'Quiet patch with low-profile response', description: 'Extra penalty if media exposure happens.' },
    { label: 'Free upgrades for all impacted customers', description: 'Protect long-term customer retention.' },
  ],
  'open-source-maintainer-burnout': [
    { label: 'Hire the maintainer full-time', description: 'Stable leadership with ongoing payroll cost.' },
    { label: 'Openly recruit community successors', description: 'Takes two rounds before impact appears.' },
    { label: 'Enter maintenance mode', description: 'Safer operations but slower product evolution.' },
  ],
  'vc-funding-winter': [
    { label: 'Lay off 10-15% to extend runway', description: 'Improves runway but hurts morale and reputation.' },
    { label: 'Accelerate monetization', description: 'Reduce dependency on fundraising in a down market.' },
    { label: 'Seek strategic investors (non-VC)', description: 'Strategic Investor card gets a cost reduction.' },
  ],
  'big-tech-competition': [
    { label: 'Focus on a differentiated niche', description: 'Narrower scope but deeper competitive edge.' },
    { label: 'Invest heavily in OSS community', description: 'Independents can often out-community big tech.' },
    { label: 'Proactively engage big tech', description: 'Raises chance of an Acquisition Offer event.' },
  ],
  'developer-migration-wave': [
    { label: 'Publish migration guides and onboarding', description: 'Capture users quickly with higher support load.' },
    { label: 'Offer one-click migration tooling', description: 'Lower migration friction for new users.' },
    { label: 'Do nothing', description: 'You still gain partial organic migration.' },
  ],
  'major-conference-talk': [
    { label: 'Ship a major feature with the talk', description: 'Maximize launch momentum from conference exposure.' },
    { label: 'Announce a new OSS module', description: 'Reinforce your open-source identity.' },
    { label: 'Announce the enterprise plan', description: 'Convert attention into monetization.' },
  ],
  'licensing-controversy': [
    { label: 'Keep the license change and justify it', description: 'More control and revenue, but larger community loss.' },
    { label: 'Roll back the license change', description: 'Recover trust but lose control.' },
    { label: 'Compromise with forward-only licensing', description: 'Keep legacy versions permissive.' },
  ],
  'docker-boom': [
    { label: 'Release official Docker image + docs', description: 'Ride ecosystem momentum with better onboarding.' },
    { label: 'Co-market with Docker', description: 'Brand upside with marketing cost.' },
    { label: 'Launch container-focused enterprise features', description: 'Monetize the container user influx.' },
  ],
  'kubernetes-adoption': [
    { label: 'Apply as a CNCF project', description: 'Strong community upside with review delay.' },
    { label: 'Ship Helm Chart / Operator', description: 'Lower deployment friction for teams.' },
    { label: 'Launch K8s-focused enterprise edition', description: 'Capture enterprise Kubernetes budgets.' },
  ],
  'ai-hype-cycle': [
    { label: 'Fast-track LLM integration and launch', description: 'Growth spike at the cost of product quality risk.' },
    { label: 'Launch later with higher quality', description: 'Short-term lag but stronger long-term trust.' },
    { label: 'Open-source your AI models/tools', description: 'Community-first AI strategy.' },
  ],
  'developer-strike': [
    { label: 'Talk with maintainers and meet demands', description: 'Recover trust, possibly at business cost.' },
    { label: 'Reject demands and push forward', description: 'More control, but deeper community damage.' },
    { label: 'Introduce TSC governance', description: 'Share control to stabilize community trust.' },
  ],
  'government-regulation': [
    { label: 'Fully comply and get certified', description: 'Higher short-term cost, strong long-term upside.' },
    { label: 'Wait and adjust gradually', description: 'Saves near-term cash but compounds risk.' },
    { label: 'Use OSS transparency for compliance', description: 'Lower compliance burden in OSS model.' },
  ],
  'patent-lawsuit': [
    { label: 'Fight in court and countersue', description: 'High risk with potentially high payoff.' },
    { label: 'Settle out of court', description: 'Expensive but predictable closure.' },
    { label: 'Join a patent protection alliance (OIN)', description: 'Smaller upfront cost, durable risk reduction.' },
  ],
  'viral-blog-post': [
    { label: 'Partner with blogger for follow-up content', description: 'Sustained exposure over multiple rounds.' },
    { label: 'Launch free trial while traffic is hot', description: 'Short-term user surge with weaker immediate revenue.' },
    { label: 'Hold steady', description: 'Preserve current gains with no extra upside.' },
  ],
  'massive-outage': [
    { label: 'Full public post-mortem + compensation', description: 'Expensive, but best for rebuilding trust.' },
    { label: 'Rapid fix with minimal statement', description: 'Cheaper now, but credibility weakens.' },
    { label: 'Open-source the root-cause fix', description: 'Turn incident response into community goodwill.' },
  ],
  'data-breach': [
    { label: 'Disclose within 72 hours and notify users', description: 'Transparency helps reduce regulatory penalties.' },
    { label: 'Delay disclosure until after internal fixes', description: 'Higher penalty risk if discovered.' },
    { label: 'Hire top-tier security firm and go public', description: 'Costly, but improves credibility.' },
  ],
  'open-source-fork': [
    { label: 'Embrace the fork and merge good contributions', description: 'Convert conflict into collaboration.' },
    { label: 'Validate legitimacy via community vote', description: 'Costs one action, may stabilize support.' },
    { label: 'Block with legal actions (IP/trademark)', description: 'Regain control with PR fallout.' },
  ],
  'acquisition-offer': [
    { label: 'Accept acquisition', description: 'Triggers acquisition-exit victory check.' },
    { label: 'Reject and remain independent', description: 'Boosts morale and long-term identity.' },
    { label: 'Use offer as financing leverage', description: 'Improve terms on your next financing move.' },
  ],
  'big-enterprise-contract': [
    { label: 'Accept and deliver deep customization', description: 'Highest revenue with product stability trade-off.' },
    { label: 'Accept with limited customization', description: 'Strong revenue while preserving product direction.' },
    { label: 'Publicize the contract case study', description: 'Unlock flagship-customer credibility.' },
  ],
  'competitor-shutdown': [
    { label: 'Ship emergency migration tooling', description: 'Fast user capture with engineering strain.' },
    { label: 'Publish competitive comparison campaign', description: 'Marketing-led user acquisition.' },
    { label: 'Offer limited-time free incentives', description: 'Trade short-term revenue for rapid growth.' },
  ],
  'industry-standardization': [
    { label: 'Lead standard-setting with resource commitment', description: 'Shape ecosystem rules at higher cost.' },
    { label: 'Participate actively without leading', description: 'Moderate upside with low overhead.' },
    { label: 'Observe and wait', description: 'Lower near-term cost, strategic opportunity loss.' },
  ],
  'foundation-formation': [
    { label: 'Approve independent foundation formation', description: 'Big trust gain with less direct control.' },
    { label: 'Reject and keep company control', description: 'More control, higher community backlash risk.' },
    { label: 'Form foundation with reserved key seats', description: 'Balanced governance compromise.' },
  ],
  'cloud-partnership': [
    { label: 'Deep cloud partnership integration', description: 'Strong revenue upside with platform dependency.' },
    { label: 'Limited partnership, stay independent', description: 'Moderate upside while preserving autonomy.' },
    { label: 'Reject due to lock-in concerns', description: 'Preserve control, miss short-term revenue.' },
  ],
  'developer-tool-integration': [
    { label: 'Optimize integration UX + release plugin', description: 'Higher adoption with added engineering load.' },
    { label: 'Run a co-launch marketing campaign', description: 'Expand reach quickly.' },
    { label: 'Use momentum as negotiation leverage', description: 'Stronger bargaining power in financing talks.' },
  ],
  'global-dev-conference': [
    { label: 'Announce major OSS milestone on stage', description: 'Strengthen community trust and momentum.' },
    { label: 'Launch new enterprise features at conference', description: 'Convert attention into monetization.' },
    { label: 'Announce Open-Core strategic transition', description: 'Balance community and business growth.' },
  ],
  'ecosystem-explosion': [
    { label: 'Build a paid plugin marketplace', description: 'Monetize ecosystem with some developer pushback.' },
    { label: 'Keep ecosystem fully open and free', description: 'Maximize adoption and monetize indirectly later.' },
  ],
  'platform-shift': [
    { label: 'Fully bet on new platform and rewrite core', description: 'Short-term pain with large long-term upside.' },
    { label: 'Migrate gradually with compatibility', description: 'Steady transition with moderate upside.' },
    { label: 'Stay on current path for conservative users', description: 'Protect renewals while losing new demand.' },
  ],
}
