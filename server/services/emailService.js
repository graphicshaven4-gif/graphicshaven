/**
 * Client inquiry notification logger
 * Note: Actual client email delivery is handled directly via Web3Forms in the contact form.
 */
const sendInquiryNotification = async (inquiry) => {
  console.log('\n=======================================================');
  console.log(`📋 [NEW INQUIRY RECEIVED]`);
  console.log(`Client:    ${inquiry.name} <${inquiry.email}> | Phone: ${inquiry.phone || 'N/A'}`);
  console.log(`Service:   ${inquiry.service} | Budget: ${inquiry.budget}`);
  console.log(`Details:   ${inquiry.details || 'None'}`);
  console.log('=======================================================\n');

  return { success: true, mode: 'web3forms' };
};

module.exports = {
  sendInquiryNotification,
};
