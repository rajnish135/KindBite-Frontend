const ReceiverFAQs = () => {
  const faqs = [
    {
      question: "How do I claim a food donation?",
      answer: "Simply tap the “Claim” button on any available donation. The pickup location is already visible before claiming, so you can decide if it's convenient.",
    },
    {
      question: "Is there any cost to receive food?",
      answer: "No, all food donations are completely free of charge. This app is built to reduce food waste and help those in need.",
    },
    {
      question: "Can I claim more than one food item at a time?",
      answer: "Yes, you can claim up to 3 items per day. Please be mindful not to hoard or claim more than you need so others can benefit too.",
    },
    {
      question: "Why can’t I see the donor's email or phone number?",
      answer: "To protect privacy, only location is shared. Our system is designed so you can collect the food without needing personal communication.",
    },
    {
      question: "What should I do after receiving the food?",
      answer: "Once the food is received, click on the “Mark as Received” button to let the donor know the food has been picked up. Optionally, you can leave a review by clicking the “Leave a Review” button after receiving the food.",
    },
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-heading">📋 Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div key={idx} className="faq-item">
            <p className="faq-question">Q: {faq.question}</p>
            <p className="faq-answer">A: {faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceiverFAQs;
