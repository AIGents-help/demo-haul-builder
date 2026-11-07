import { Navigate } from "react-router-dom";

// The old password-only availability page was removed (shared default password).
// Availability is managed from the signed-in dashboard (Settings tab).
const Admin = () => <Navigate to="/dashboard" replace />;

export default Admin;
