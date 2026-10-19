export const promptCategories = ["All", "Sales", "Marketing", "Operations", "Support", "Product"];
export const prompts = [
    {
        id: "customer-language",
        category: "Marketing",
        title: "Find the words customers actually use",
        when: "Use after collecting customer interviews, reviews or support conversations. Remove personal information first.",
        prompt: "You are a careful customer-research assistant. Review the anonymised notes below. Group recurring customer needs in their own language. For each theme, include a short evidence quote, how often it appears, and what you are uncertain about. Do not invent quotes or assume a theme is important just because it sounds polished.\n\n[PASTE ANONYMISED NOTES]",
    },
    {
        id: "sales-follow-up",
        category: "Sales",
        title: "A thoughtful follow-up, not a chase",
        when: "Use after a real conversation when you want a relevant next step without pressure.",
        prompt: "Draft a concise, human follow-up email using only the notes below. Reflect the prospect's stated priority, offer one useful next step, and keep the tone warm and low-pressure. Do not invent commitments, results, or urgency. Ask me to fill any missing facts rather than guessing.\n\nConversation notes: [ADD NOTES]\nNext step: [ADD NEXT STEP]",
    },
    {
        id: "campaign-starters",
        category: "Marketing",
        title: "Campaign angles grounded in a real brief",
        when: "Use at the start of a campaign to explore directions before writing final copy.",
        prompt: "Act as a creative strategist. From the brief below, propose three genuinely different campaign angles. For each, state the audience insight, core idea, a sample headline, and what must be validated. Keep claims within the supplied evidence and avoid generic superlatives.\n\nBrief: [ADD BRIEF]",
    },
    {
        id: "meeting-to-actions",
        category: "Operations",
        title: "Meeting notes into clear next steps",
        when: "Use with approved notes to make ownership and open questions visible.",
        prompt: "Turn the notes below into: decisions made, actions with named owners and dates only when explicitly present, and unresolved questions. Preserve uncertainty. If an owner or deadline is missing, label it 'unassigned' or 'not set'. Do not add new decisions.\n\nNotes: [PASTE APPROVED NOTES]",
    },
    {
        id: "support-response",
        category: "Support",
        title: "A clear, kind first support reply",
        when: "Use as a draft aid; check account details and policy before sending.",
        prompt: "Draft a kind, plain-language first response to the customer issue below. Acknowledge the impact, explain only what is confirmed, and ask at most one focused question if needed. Never request passwords, payment-card details, or sensitive personal data. Do not promise a resolution time unless one is provided.\n\nApproved policy: [ADD POLICY]\nIssue: [ADD ISSUE]",
    },
    {
        id: "product-feedback",
        category: "Product",
        title: "Turn feedback into testable questions",
        when: "Use when synthesising feedback to decide what to investigate—not to skip research.",
        prompt: "Summarise the anonymised product feedback below into observed behaviours, user-stated needs, possible explanations, and unanswered questions. Separate evidence from interpretation. Suggest two lightweight research questions; do not recommend a feature unless the evidence supports it.\n\nFeedback: [PASTE ANONYMISED FEEDBACK]",
    },
];
