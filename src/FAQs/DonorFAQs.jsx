import './style.css';

const FAQs = () => {
  const faqList = [
    {
      question: "How can I donate food?",
      answer: "Log in and go to the 'Donate' section, fill out the form with food details, upload a photo, and submit. Your donation will be listed as 'available' for nearby receivers.",
    },
    {
      question: "Is it necessary to upload a photo while donating?",
      answer: "Yes, adding a photo helps receivers understand what’s being offered and builds trust. It also improves visibility of your donation.",
    },
    {
    question: "What happens if no one claims my donation?",
    answer: "If a donation isn't claimed within a safe window (e.g., 24 hours), it will be flagged as 'Might be stale' and deleted by the admin.",
    },
    {
      question: "Can I track how many donations I’ve made?",
      answer: "Yes. Go to 'My Profile' or 'All Donations' to view your total donations and their status.",
    },
    {
      question: "Is my personal information shared with others?",
      answer: "Only your email is shared with the admin — never publicly.",
    },
    {
      question: "What kind of food can I donate?",
      answer: "You can donate freshly cooked food, packaged food, or surplus groceries. Avoid spoiled, expired, or half-eaten food.",
    },
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-heading">📋 Frequently Asked Questions</h2>
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

export default FAQs;
