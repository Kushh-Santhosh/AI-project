const sourceCatalog = {
  echallan: {
    title: 'MoRTH eChallan portal', url: 'https://echallan.parivahan.gov.in/index/challan-status',
    publisher: 'Ministry of Road Transport and Highways',
  },
  virtualCourts: {
    title: 'Virtual Courts FAQ', url: 'https://vcourts.gov.in/virtualcourt/faq.php', publisher: 'Department of Justice, Government of India',
  },
  motorVehicles: {
    title: 'Motor Vehicles Act, 1988 (India Code)', url: 'https://www.indiacode.nic.in/bitstream/123456789/19848/1/the-motor-vehicles-act-1988.pdf', publisher: 'India Code, Ministry of Law and Justice',
  },
  karnatakaRent: {
    title: 'Karnataka Rent Act, 1999 (India Code)', url: 'https://www.indiacode.nic.in/bitstream/123456789/7810/1/34_of_2001_e.pdf', publisher: 'India Code, Ministry of Law and Justice',
  },
  nalsa: { title: 'Legal aid information', url: 'https://nalsa.gov.in/legal-aid/', publisher: 'National Legal Services Authority' },
  samadhan: { title: 'SAMADHAN worker grievance portal', url: 'https://samadhan.labour.gov.in/', publisher: 'Ministry of Labour and Employment' },
  consumerAct: {
    title: 'Consumer Protection Act, 2019 (India Code)', url: 'https://www.indiacode.nic.in/bitstream/123456789/15256/1/eng201935.pdf', publisher: 'India Code, Ministry of Law and Justice',
  },
  nch: { title: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in/', publisher: 'Department of Consumer Affairs, Government of India' },
  cyber: { title: 'National Cyber Crime Reporting Portal', url: 'https://cybercrime.gov.in/', publisher: 'Indian Cyber Crime Coordination Centre, Ministry of Home Affairs' },
  cyberFaq: { title: 'Cybercrime reporting and 1930 information', url: 'https://cybercrime.gov.in/Webform/FAQ.aspx', publisher: 'Indian Cyber Crime Coordination Centre, Ministry of Home Affairs' },
  contract: { title: 'Indian Contract Act, 1872 (India Code)', url: 'https://www.indiacode.nic.in/handle/123456789/2187', publisher: 'India Code, Ministry of Law and Justice' },
};

const makeOption = (title, when, pros, limitations, steps, documents, law, sourceIds, next) => ({
  title, explanation: '', when_to_choose: when, pros: [pros], limitations: [limitations], steps,
  documents, law, cost_or_penalty: 'No amount or fee verified for your specific facts.',
  sources: sourceIds.map((id) => sourceCatalog[id]), next_step: next,
});

const topics = [
  {
    id: 'traffic_incorrect', label: 'Traffic challan dispute', threshold: 3,
    keywords: ['incorrect challan', 'wrong challan', 'false challan', 'dispute challan', 'challenge challan', 'challan error', 'not my vehicle', 'wrong vehicle', 'traffic challan', 'e-challan', 'echallan'],
    options: [
      makeOption('Check the challan and request a record correction', 'Start here to verify the offence and raise a grievance if the record contains a factual or administrative error.', 'May correct a record mismatch without a court contest.', 'A grievance does not decide a legal challenge and may not pause a court process.', ['Open the MoRTH eChallan portal and search using the available challan or vehicle details.', 'Compare the offence, date, place, and vehicle details with your records.', 'If a field is wrong, use the grievance/help channel linked from the portal and save its reference.'], ['Challan number or notice', 'Vehicle registration and proof of the discrepancy'], 'The Motor Vehicles Act, 1988 applies to motor vehicle offences; the specific allegation and applicable state rules need checking.', ['echallan', 'motorVehicles'], 'Check the record and document any mismatch before choosing the next route.'),
      makeOption('Request to contest through Virtual Courts', 'Consider this if you dispute liability and the challan is available in Virtual Courts.', 'Provides an official route to request that a listed matter be heard by a court.', 'Availability and steps depend on the challan; follow the portal instructions and court notice.', ['Search the Virtual Courts portal using an accepted case identifier.', 'Review the case details and select the portal option to contest if available.', 'Keep the acknowledgement and attend or respond to any court directions.'], ['Challan or case details', 'Contact details for portal verification'], 'The portal explains its case search and contest process; case-specific procedure must be checked on the live record.', ['virtualCourts'], 'Check whether the challan appears in Virtual Courts before paying it.'),
      makeOption('Get legal help if the matter escalates', 'Use this if a formal court notice or hearing arrives, or you are unsure how to respond to a disputed challan.', 'A local lawyer or legal services authority can assess evidence, procedure, and dates.', 'Advice cannot guarantee cancellation; do not ignore a notice or court date while seeking help.', ['Keep the challan, contest/grievance acknowledgements, and supporting evidence together.', 'Note every court or response date shown on an official notice.', 'Ask a qualified local lawyer or legal services authority how to respond and attend as directed.'], ['Challan and official notices', 'Contest/grievance references and supporting records'], 'The procedure depends on the listed case and court directions; check the official notice and seek case-specific advice.', ['virtualCourts', 'nalsa'], 'If a court notice or date appears, get local advice promptly and follow the notice.'),
    ],
  },
  {
    id: 'traffic_helmet', label: 'Helmet or traffic challan', threshold: 2,
    keywords: ['helmet', 'headgear', 'scooter', 'motorcycle', 'motorbike', 'traffic challan', 'e-challan', 'echallan', 'traffic fine'],
    options: [
      makeOption('Verify the notice and decide whether to pay', 'If the details are correct and you accept the allegation, verify the amount and payment destination first.', 'Resolves an accepted challan through the official service.', 'Do not use links in suspicious messages; an accepted payment may close the portal matter. This app does not determine whether you have a defence.', ['Open the official MoRTH eChallan site directly.', 'Check the offence, vehicle, date, and amount shown on the official record.', 'Pay only if you accept the notice, and save the receipt.'], ['Challan details', 'Vehicle registration details'], 'Motor Vehicles Act, 1988 section 129 requires protective headgear in covered circumstances; section 194D addresses penalties. Verify current applicability and the notice.', ['echallan', 'motorVehicles'], 'Check the official record before paying.'),
      makeOption('Request to contest the challan', 'If you dispute the notice or want a court to consider it, check the official contest route.', 'Keeps a disputed matter in the official process for review.', 'Follow the case-specific directions and any court date; this is not a guarantee of cancellation.', ['Search for the challan in Virtual Courts.', 'If the case is listed, follow the portal option to contest and save the acknowledgement.', 'Respond to any hearing or document direction shown by the court.'], ['Challan or case number', 'Relevant evidence, such as location or vehicle records'], 'Virtual Courts provides a route to request contest of an eligible listed case; check the live case instructions.', ['virtualCourts'], 'Check whether the case is listed in Virtual Courts.'),
      makeOption('Get legal help if a formal proceeding begins', 'Use this if a court notice, hearing date, or serious dispute arises, or you need help deciding how to contest.', 'A qualified adviser can explain the applicable process and help organise the evidence.', 'Costs and outcomes vary; legal advice does not guarantee cancellation and does not replace attending a listed hearing.', ['Keep the challan, payment/contest records, and evidence in one file.', 'Note the court, response, or hearing date stated in any official notice.', 'Consult a local lawyer or legal services authority and follow the notice/court directions.'], ['Challan and court notice', 'Vehicle records and evidence relevant to the allegation'], 'The applicable procedure depends on the challan and the court directions; verify the live case.', ['virtualCourts', 'nalsa'], 'Seek local advice promptly if the matter reaches court.'),
    ],
  },
  {
    id: 'landlord', label: 'Rental deposit or landlord dispute', threshold: 2,
    keywords: ['landlord', 'tenant', 'owner', 'deposit', 'owner keeping deposit', 'return my deposit', 'refund deposit', 'rental deposit', 'rental advance', 'rent deposit', 'vacated flat', 'vacated the flat', 'moved out', 'returned keys', 'rented flat', 'lease deposit', 'isnt refunding my money'],
    options: [
      makeOption('Review the agreement and make a written request', 'Start here when the lease, payment proof, or move-out condition may explain the deposit or proposed deductions.', 'Creates a clear record and may resolve a misunderstanding quickly.', 'The agreement and property type can change the applicable rules; avoid agreeing to an unexplained deduction.', ['Review the signed agreement for deposit, inspection, notice, and deduction terms.', 'Collect proof of payment, key return, move-out inspection, and property condition.', 'Send a dated written request asking for the deposit or an itemised explanation of deductions.'], ['Rental agreement', 'Deposit transfer, key-return, inspection, and message records'], 'The Karnataka Rent Act, 1999 may apply only depending on the premises and statutory scope; this guide does not decide applicability.', ['karnatakaRent'], 'Send a concise written request with a reasonable response date and keep delivery proof.'),
      makeOption('Try a documented resolution or mediation', 'Consider this if communication remains possible and both sides may agree on deductions or repayment.', 'Can settle the amount without starting a court case.', 'Participation is generally voluntary; do not sign a settlement you do not understand.', ['Send a written proposal listing the amount sought and any disputed deductions.', 'Offer a neutral meeting or a suitable mediation process.', 'Put any agreement, payment schedule, or release in writing before closing the dispute.'], ['Agreement', 'Move-in/move-out photos, inspection notes, and communication history'], 'No single mediation forum or mandatory process is verified for every tenancy dispute.', ['nalsa'], 'Propose a written settlement and ask for an itemised account.'),
      makeOption('Seek legal aid or a civil remedy', 'Consider this when a written demand does not resolve a material deposit dispute.', 'A lawyer or legal services authority can assess the agreement, evidence, forum, and remedy.', 'Forum, cost, limitation, and outcome depend on the facts; do not rely on a fixed deadline from this guide.', ['Organise the agreement, payment proof, key return, property condition, and demand correspondence.', 'Ask a local lawyer or District Legal Services Authority whether legal aid or a suitable court/settlement process applies.', 'Check any limitation period and required notice before filing.'], ['All tenancy, payment, handover, and communication records'], 'The Karnataka Rent Act and general civil law may be relevant, but applicability needs case-specific review.', ['karnatakaRent', 'nalsa'], 'Get the tenancy agreement and evidence reviewed locally before filing.'),
    ],
  },
  {
    id: 'salary', label: 'Unpaid salary or employment dues', threshold: 2,
    keywords: ['unpaid salary', 'salary not paid', 'wages not paid', 'unpaid wages', 'employer has not paid', 'employer withheld my salary', 'withheld my salary', 'withheld my wages', 'withheld salary', 'wages withheld', 'salary withheld', 'paycheck', 'arrears', 'pending salary', 'employment dues', 'overtime not paid'],
    options: [
      makeOption('Request payment and an itemised explanation', 'Use this first when the employer may have a payroll or records issue.', 'Creates a dated record of the amount and period claimed.', 'The applicable law can depend on worker status, salary type, location, and current labour rules.', ['Write to payroll and the employer identifying the unpaid period and amount.', 'Ask for an itemised explanation of any deduction or hold.', 'Keep proof that the request was sent and note the response.'], ['Offer/appointment letter or contract', 'Payslips, attendance, bank statements, and messages'], 'The specific wage law and forum require checking against your role and current law.', ['samadhan'], 'Send a written request identifying dates and amounts.'),
      makeOption('Use the Labour Ministry grievance channel', 'Consider the SAMADHAN portal for eligible employment or wage grievances.', 'Provides a government channel for certain worker grievances and claims.', 'Eligibility and jurisdiction depend on the nature of work and claim; a portal filing may not cover every employee.', ['Check the SAMADHAN portal description and whether your claim fits.', 'Prepare a concise chronology and supporting records.', 'Submit through the official route if eligible, and save the acknowledgement.'], ['Employer details', 'Work and wage records, prior requests, and calculation of dues'], 'Applicable labour provisions and competent authority vary; verify them for your work category.', ['samadhan'], 'Check the portal’s current eligibility and file only with accurate details.'),
      makeOption('Seek local legal advice or legal aid', 'Consider this if the employer denies the claim, the amount is significant, or a deadline may apply.', 'A qualified adviser can identify the correct authority, procedure, and limitation period.', 'Forum, costs, and time limits cannot be determined without employment details.', ['Organise your contract, wage records, attendance, and correspondence.', 'Ask a local employment lawyer or legal services authority to identify the proper claim route.', 'Follow the identified authority’s filing and evidence requirements.'], ['Employment agreement', 'Payslips, bank records, time records, and written demands'], 'Specific statutory provisions require verification based on employment status and current law.', ['nalsa', 'samadhan'], 'Get advice on the correct forum and any deadline before filing.'),
    ],
  },
  {
    id: 'consumer', label: 'Consumer complaint or defective product', threshold: 2,
    keywords: ['defective product', 'faulty product', 'consumer complaint', 'refund refused', 'seller refusing refund', 'bad service', 'warranty repair', 'replacement refused', 'online order', 'damaged goods', 'product defect'],
    options: [
      makeOption('Ask the seller or service provider to fix it', 'Start with this when the seller can repair, replace, refund, or explain the issue.', 'Often the quickest route and creates a record of your requested remedy.', 'Warranty terms, proof of purchase, exclusions, and facts matter.', ['Send a written complaint describing the defect and the remedy requested.', 'Attach order/invoice and clear photos or service records.', 'Keep the seller’s reply and avoid discarding the product or packaging until the issue is documented.'], ['Invoice or order confirmation', 'Photos/video, warranty, and prior support ticket'], 'The Consumer Protection Act, 2019 covers consumer protection; whether a particular transaction qualifies needs review.', ['consumerAct'], 'Write to the seller with the purchase date, defect, and requested remedy.'),
      makeOption('Raise a National Consumer Helpline grievance', 'Consider this if the seller’s own support channel does not resolve the complaint.', 'Offers an official consumer grievance channel for pursuing a resolution.', 'A grievance channel is not a court order and does not guarantee a refund.', ['Open the National Consumer Helpline and check its current submission process.', 'Enter only accurate purchase and seller details and attach supporting records.', 'Save the grievance number and track the response.'], ['Invoice or order details', 'Seller correspondence and evidence of defect'], 'The Consumer Protection Act, 2019 is relevant generally; the helpline’s role is grievance facilitation.', ['nch', 'consumerAct'], 'Submit a documented grievance through the official NCH portal.'),
      makeOption('Consider a Consumer Commission case', 'Consider formal consumer redress if informal resolution fails and the transaction is within the law.', 'A Consumer Commission can consider eligible consumer disputes and remedies.', 'Jurisdiction, limitation, filing process, and relief depend on the claim; verify current filing rules.', ['Organise the invoice, defect evidence, seller complaint, and responses.', 'Check the applicable Consumer Commission and current filing instructions.', 'Seek legal aid or advice if the claim, limitation, or forum is unclear.'], ['Proof of purchase', 'Product/service evidence and complaint correspondence'], 'Consumer Protection Act, 2019; case eligibility and procedure require fact-specific checking.', ['consumerAct', 'nalsa'], 'Check current Consumer Commission filing requirements before filing.'),
    ],
  },
  {
    id: 'fraud', label: 'Online payment fraud or cybercrime', threshold: 2,
    keywords: ['online payment fraud', 'payment fraud', 'upi fraud', 'upi scam', 'cyber fraud', 'lost money online', 'money stolen', 'unauthorised transaction', 'unauthorized transaction', 'phishing payment', 'bank fraud', 'card fraud', 'scammed online', 'financial fraud'],
    urgent: 'Act promptly: contact your bank or payment provider using its official channel, ask it to record the disputed transaction and secure affected payment access, preserve transaction records, and report suspected online financial fraud through 1930 and the National Cyber Crime Reporting Portal. Do not share OTPs, PINs, passwords, or remote-access codes. Reporting does not guarantee recovery.',
    options: [
      makeOption('Contact the bank or payment provider now', 'Do this immediately for an unauthorised or deceptive payment.', 'Can alert the institution and start its dispute/security process promptly.', 'A reversal or hold is not guaranteed; use contact details from the official app/card/site.', ['Call or message the bank/payment provider through its official channel and report the transaction.', 'Ask it to block or secure affected payment instruments and record a dispute/reference number.', 'Change exposed credentials from a trusted device and do not share OTPs or PINs.'], ['Transaction ID, date, amount, bank/provider reference', 'Screenshots and relevant messages'], 'The provider’s current dispute and security rules apply; this guide does not promise reimbursement.', ['cyber', 'cyberFaq'], 'Contact the provider immediately and keep the complaint reference.'),
      makeOption('Report through 1930 and the national cybercrime portal', 'Use the national reporting channel promptly for suspected financial cyber fraud.', 'Creates a report for the appropriate authorities to review and coordinate with financial institutions.', 'Reporting does not guarantee that funds will be frozen or recovered; submit accurate facts.', ['Call 1930 promptly and follow the operator’s instructions.', 'Use the official National Cyber Crime Reporting Portal to complete or track the report as instructed.', 'Save the acknowledgement and supply transaction evidence when requested.'], ['Transaction details and bank/provider reference', 'Screenshots, phone/email used, and report acknowledgement'], 'The official portal identifies 1930 as the immediate reporting helpline for financial cyber fraud.', ['cyber', 'cyberFaq'], 'Report promptly by 1930 and keep the acknowledgement.'),
      makeOption('Preserve evidence and follow up with police or the provider', 'Use this alongside urgent reporting, especially if there are continuing threats or account access issues.', 'Builds a clear record for follow-up investigation and disputes.', 'Do not delay urgent reporting while gathering evidence; police and bank processes vary.', ['Preserve original messages, URLs, call logs, receipts, and screenshots without editing them.', 'Follow up with the bank/provider and cybercrime report using their references.', 'If there is immediate danger, contact local emergency services; otherwise ask local police how to submit supporting information.'], ['Original messages and call logs', 'Transaction records and complaint references'], 'Applicable criminal and financial rules depend on the facts; no outcome or recovery is assured.', ['cyber', 'nalsa'], 'Save evidence and follow up using your complaint references.'),
    ],
  },
  {
    id: 'harassment', label: 'Online harassment, threats, or abuse', threshold: 2,
    keywords: ['online harassment', 'harassing me online', 'cyberbullying', 'threatening messages', 'online threats', 'threats', 'blackmail', 'doxxing', 'stalking online', 'abusive messages', 'intimate images threat', 'social media harassment', 'extortion'],
    urgent: 'If you are in immediate physical danger, move to a safer place and contact local emergency services (112 in India). Do not wait for this analysis.',
    options: [
      makeOption('Preserve evidence and secure accounts', 'Use this when it is safe to do so and before content or accounts disappear.', 'Preserves details that can help a platform or authority assess the report.', 'Do not engage with or threaten the person; avoid forwarding intimate content.', ['Save original messages, profile links, dates, and screenshots with context.', 'Secure accounts, change reused passwords, enable additional sign-in protection, and review active sessions.', 'Block or restrict contact if safe; preserve a copy before content is removed.'], ['Original URLs/messages and timestamps', 'Account security and platform report references'], 'The applicable law depends on the conduct and evidence; this offline guide does not classify an offence.', ['cyber'], 'Preserve evidence safely and secure affected accounts.'),
      makeOption('Report the account or content to the platform', 'Consider this for abuse, impersonation, threats, or content that violates platform rules.', 'May restrict or remove content and creates a platform report record.', 'Platform action is not a substitute for contacting police where threats or crime are involved.', ['Use the platform’s in-app report mechanism.', 'Describe the conduct and include the original links or identifiers.', 'Save the report reference and avoid public escalation that may expose more personal information.'], ['Content URL and screenshots', 'Platform report acknowledgement'], 'Platform rules and legal routes are distinct; the facts determine which applies.', ['cyber'], 'Report the content using the platform’s official reporting feature.'),
      makeOption('Report serious threats to police or cybercrime authorities', 'Use this for credible threats, stalking, extortion, intimate-image abuse, or repeated serious conduct.', 'Allows authorities to assess safety and investigate under applicable law.', 'The appropriate unit and legal classification depend on location and facts; emergency danger requires immediate help.', ['If danger is immediate, contact local emergency services (112 in India).', 'Otherwise report to local police or the official cybercrime portal and provide preserved evidence.', 'Keep complaint details and seek legal aid if you need help with the next step.'], ['Evidence files and original URLs', 'Threat chronology and prior report references'], 'Specific criminal provisions require fact-specific assessment.', ['cyber', 'nalsa'], 'For immediate danger call emergency services; otherwise make a documented report.'),
    ],
  },
  {
    id: 'notice', label: 'Understanding a legal notice', threshold: 2,
    keywords: ['legal notice', 'demand notice', 'lawyer notice', 'received notice', 'notice from court', 'respond to notice', 'reply to notice', 'summons'],
    options: [
      makeOption('Verify the notice and note every date', 'Start by identifying who sent it, what it demands, and whether it is a court document.', 'Prevents missed response dates and mistaken admissions.', 'A court summons or statutory notice may have strict requirements; do not rely on generic time limits.', ['Keep the original notice, envelope, email headers, and delivery proof.', 'Note any response date, hearing date, case number, or authority listed.', 'Verify the sender through independent official contact details if authenticity is uncertain.'], ['Notice and envelope/delivery proof', 'Related agreements, payments, or correspondence'], 'The correct response and deadline depend on the type of notice and applicable law.', ['nalsa'], 'Identify whether the document is a court summons and note the earliest date.'),
      makeOption('Collect records and prepare a factual response', 'Consider this after checking the allegations and any response deadline.', 'A documented, measured response can clarify facts and preserve your position.', 'Do not admit liability, make threats, or ignore a deadline; obtain advice where stakes are significant.', ['Create a chronology matching each allegation to records.', 'Preserve original documents and avoid altering messages or files.', 'Have a qualified lawyer review a formal reply when the claim or deadline is material.'], ['Notice', 'Contract, receipts, messages, and other records cited in the notice'], 'No response template or deadline is safe to prescribe without seeing the notice and identifying its legal basis.', ['nalsa'], 'Gather the cited records and seek review before the stated response date.'),
      makeOption('Seek legal aid or a negotiated resolution', 'Consider advice if the notice seeks money, threatens proceedings, or is difficult to understand.', 'A lawyer or eligible legal aid service can explain consequences and possible resolution.', 'Negotiation does not automatically pause a court or statutory deadline.', ['Contact a local lawyer or legal services authority with the notice and chronology.', 'Ask what forum, response, and deadline apply.', 'If settlement is appropriate, put terms in writing and confirm their effect before signing.'], ['Complete notice set and delivery records', 'Relevant contracts and evidence'], 'Applicable law is notice-specific; this guide cannot assess the legal effect of an unseen document.', ['nalsa'], 'Arrange a review promptly if a court or authority date appears.'),
    ],
  },
  {
    id: 'contract', label: 'Contract or payment dispute', threshold: 2,
    keywords: ['contract dispute', 'breach of contract', 'breached our written agreement', 'breached agreement', 'agreement dispute', 'not following agreement', 'vendor not delivering', 'service contract', 'payment due under agreement', 'advance not returned', 'work not completed', 'contractor dispute'],
    options: [
      makeOption('Review the agreement and build a chronology', 'Start by checking the promised work, payment terms, dates, and any notice clause.', 'Clarifies what was agreed and what evidence is missing.', 'A document’s legal effect can depend on the full terms and surrounding facts.', ['Collect the signed agreement and any amendments.', 'List performance, payments, missed dates, and communications in order.', 'Identify the specific remedy you want and any contract notice requirement.'], ['Agreement and amendments', 'Invoices, payment proof, delivery records, messages'], 'The Indian Contract Act, 1872 is a general contract-law source; the relevant rule depends on the agreement and facts.', ['contract'], 'Read the entire agreement and record the specific unperformed obligation.'),
      makeOption('Send a clear written request to resolve the breach', 'Consider this when the other party may still perform, correct the issue, or refund an amount.', 'Creates a record and may resolve the dispute without formal proceedings.', 'Avoid waiving rights or agreeing to a changed deal without understanding its effect.', ['Describe the agreed obligation and what remains incomplete.', 'State the practical remedy you request and a reasonable response date.', 'Keep proof of delivery and the reply.'], ['Agreement', 'Proof of payment/performance and prior communication'], 'Contract terms and applicable law determine any notice requirements or remedy.', ['contract'], 'Send a factual written request tied to the contract terms.'),
      makeOption('Explore mediation or obtain legal advice', 'Consider this if informal resolution fails or the amount, deadline, or consequences are significant.', 'A neutral process or lawyer can identify a suitable dispute route.', 'Costs, forum, limitation, and enforceability depend on the agreement and law.', ['Check whether the agreement includes a dispute-resolution clause.', 'Ask a lawyer or legal services authority about negotiation, mediation, arbitration, or court options.', 'Before filing or signing a settlement, confirm deadlines and the effect on other remedies.'], ['Agreement and dispute correspondence', 'Payment/performance evidence and loss calculation'], 'Indian Contract Act, 1872 may be relevant; exact sections and remedies need case-specific verification.', ['contract', 'nalsa'], 'Get advice on the dispute clause and any limitation date.'),
    ],
  },
];

const normalize = (value) => value.toLocaleLowerCase().replace(/[^a-z0-9₹]+/g, ' ').trim();

export function findOfflineTopic(problem) {
  const query = normalize(problem);
  let best = null;
  for (const topic of topics) {
    let score = 0;
    for (const keyword of topic.keywords) {
      const term = normalize(keyword);
      if (query.includes(term)) score += term.includes(' ') ? 3 : 2;
    }
    if (score >= topic.threshold && (!best || score > best.score)) best = { topic, score };
  }
  return best?.topic || null;
}

export function offlineAnswer(problem, state = '', city = '') {
  const topic = findOfflineTopic(problem);
  const sourcesByUrl = new Map();
  const recommendations = topic?.options || [
    makeOption('Preserve the relevant documents and timeline', 'Use this for any legal issue while identifying the correct topic and forum.', 'Protects evidence and makes later advice more useful.', 'This general step does not determine your rights or preserve a legal deadline by itself.', ['Keep original documents, messages, receipts, notices, and dates together.', 'Write a short factual timeline and identify the outcome you want.', 'Do not alter records or publish private information.'], ['Agreements, notices, payment records, messages, and dated evidence'], 'The relevant law cannot be identified from the information provided.', ['nalsa'], 'Save the original records and note any date in a notice or court document.'),
    makeOption('Make a careful written request or response', 'Use this when a specific person or organisation can address the issue.', 'Creates a record of the issue and requested resolution.', 'Do not admit facts, make threats, or miss a formal deadline; get advice if stakes are high.', ['Identify the other party and the specific event or obligation.', 'State the outcome requested in a calm, factual message.', 'Keep proof of what was sent and any response.'], ['Relevant agreement, correspondence, and supporting records'], 'No case-specific legal provision can be identified without the issue and jurisdiction.', ['nalsa'], 'Write down the key facts and requested outcome before contacting the other party.'),
    makeOption('Get issue-specific advice before formal action', 'Use this if the issue involves a deadline, court document, significant money, safety, or unclear legal rights.', 'A qualified adviser can identify the law, forum, and limitation period that apply.', 'Eligibility for free legal aid varies; a consultation does not guarantee an outcome.', ['Identify your state/city, dates, parties, and any notice or case number.', 'Contact a local lawyer or legal services authority.', 'Ask specifically about the correct forum, deadline, evidence, and costs.'], ['Your timeline and original supporting documents'], 'Case-specific provisions require verification; the app has not classified this question.', ['nalsa'], 'Tell us what happened, where it happened, and what outcome you want.'),
  ];

  for (const option of recommendations) {
    option.sources = option.sources.map((source) => ({
      ...source,
      note: 'Saved official reference; this link and its current content were not fetched in this offline response.',
    }));
    for (const source of option.sources) {
      sourcesByUrl.set(source.url, {
        ...source,
        excerpt: `Saved official reference for ${topic?.label || 'general legal information'}. It has not been fetched or checked during this offline response.`,
        published_date: null,
        verification_status: 'Saved official source reference — not checked live in this offline response.',
      });
    }
    option.explanation = topic
      ? `Based on your description, this is a possible ${topic.label.toLowerCase()} route. Confirm the facts and eligibility before acting.`
      : 'This is a general legal-action step because the local knowledge base does not recognise the issue well enough to identify a specific law.';
    option.description = option.explanation;
  }

  const sources = [...sourcesByUrl.values()];
  const urgent = topic?.urgent || '';
  const location = [city, state].filter(Boolean).join(', ');
  return {
    question: problem.length > 120 ? `${problem.slice(0, 117)}…` : problem,
    category: topic?.label || 'General legal action checklist',
    needs_follow_up: !topic,
    follow_up_questions: topic ? [] : ['What happened, and what outcome are you seeking?', 'In which Indian state/city did this happen, and is there a notice or deadline?'],
    recommendations,
    next_steps: urgent
      ? [urgent, 'Preserve original evidence and write down the key dates.', 'Use the relevant official source below; online verification is unavailable in this response.']
      : ['Preserve original documents and note important dates.', 'Use the first option that matches your facts and keep copies of all submissions.', topic ? `Check local applicability for ${location || state || 'your location'} before taking formal action.` : 'Answer the follow-up questions or seek local legal advice before relying on a case-specific legal rule.'],
    legal_sources: sources,
    guidance_mode: 'offline',
    recommended_next_action: recommendations[0].next_step,
    warnings: [
      'Offline source links are saved references and were not checked live for this response.',
      topic ? 'Check current procedures, jurisdiction, and any deadline against the official notice or source.' : 'The issue was not matched to a specific offline legal topic; no case-specific rule is asserted.',
    ],
    research_status: 'offline_knowledge_base',
    research_note: 'Offline guidance — online verification unavailable. These saved official source links were not checked live for this response; case-specific rules, current procedures, and deadlines need verification.',
    urgency_notice: urgent || null,
    disclaimer: 'General legal information only. This offline guide cannot determine your legal rights or guarantee an outcome. Verify important decisions with a qualified Indian lawyer.',
    state: state || null, city: city || null,
    selected_provider: null,
    status: 'offline',
  };
}

export function getOfflineTopicIds() {
  return topics.map(({ id }) => id);
}
