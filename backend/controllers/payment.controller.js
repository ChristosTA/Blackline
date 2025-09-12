import * as payments from "../services/payment.service.js";



export const createCheckoutSession = async (req, res) => {
	try {
		const data = await payments.createCheckoutSession(
			req.user,
			req.validated ?? req.body,
			process.env.CLIENT_URL
		);
		res.status(200).json(data);
	} catch (error) {
		res.status(error.status || 500).json({ message: error.status===500?'Error processing checkout':error.message, error: error.message });
	}
};

// Αν ΘΕΛΕΙΣ success endpoint από server-side (προαιρετικό):
export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const data = await payments.finalizeCheckout(sessionId); // δες τη function παρακάτω στο service
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};
