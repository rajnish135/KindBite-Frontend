import './styles/DonorFAQs.css'

const AdminFAQs = () => {
  const faqList = [
    {
      question: "How do I know if a food item might be stale?",
      answer: "The system automatically flags older donations with a 'Might be stale' tag and a red dot. Admins can delete such items if not claimed within a safe window.",
    },
    {
      question: "What actions can an admin take on stale or suspicious donations?",
      answer: "Admins can delete stale food items and suspend the donor if needed. Both actions are available directly from the donation card.",
    },
    {
      question: "Can I suspend a donor or receiver manually?",
      answer: "Yes. Each donation card provides 'Suspend Donor' and 'Suspend Receiver' buttons to take action immediately.",
    },
    {
      question: "How is the donation status tracked?",
      answer: "Donations go through statuses: 'available' or 'deleted' → 'claimed' → 'picked'. Admins can monitor each status to ensure smooth handovers.",
    },
    {
      question: "Are donor and receiver emails visible?",
      answer: "Yes. Admins can view the donor and receiver email addresses in the donation cards to contact or take necessary actions.",
    },
    {
      question: "What does 'Delete This Stale Item' do?",
      answer: "This removes a donation marked stale from the system. It’s used when food is no longer safe or has passed the pickup window.",
    },
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-heading">🛠️ Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqList.map((faq, index) => (
          <div key={index} className="faq-item">
            <p className="faq-question">Q: {faq.question}</p>
            <p className="faq-answer">A: {faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFAQs;
