import mongoose from "mongoose";
import app from "./app.js";

// ΜΟΝΟ εκτός test:
if (process.env.NODE_ENV !== "test") {
	(async () => {
		try {
			await mongoose.connect(process.env.MONGO_URI);
			const PORT = process.env.PORT || 5000;

			// guard για διπλό import στο ίδιο process
			if (!global.__server_started__) {
				global.__server_started__ = true;
				app.listen(PORT, () => {
					console.log(`Server is running on http://localhost:${PORT}`);
				});
			}
		} catch (err) {
			console.error("Failed to start server:", err);
			process.exit(1);
		}
	})();
}

export default app;
