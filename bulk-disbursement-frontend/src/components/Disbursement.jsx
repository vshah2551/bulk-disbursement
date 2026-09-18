import { useNavigate } from "react-router-dom";
import "../css/Disbursement.css";

function Disbursement() {

    const navigate = useNavigate();

    return (
        <div className="disbursement-page">

            <div className="disbursement-container">

                <div className="disbursement-header">

                    <div>
                        <h1>Disbursements</h1>

                        <p>
                            Manage bulk payments to registered payees.
                        </p>
                    </div>

                </div>

                <div className="disbursement-cards">

                    {/* Create Disbursement */}

                    <div className="disbursement-card">

                        <div className="disbursement-card-icon">
                            +
                        </div>

                        <h2>
                            Create Disbursement
                        </h2>

                        <p>
                            Create a new bulk disbursement by
                            selecting a scheme, payees and payment
                            amount.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/create-disbursement")
                            }
                        >
                            Create Disbursement
                        </button>

                    </div>

                    {/* Disbursement List */}

                    <div className="disbursement-card">

                        <div className="disbursement-card-icon">
                            ☷
                        </div>

                        <h2>
                            View Disbursements
                        </h2>

                        <p>
                            View previously created disbursements
                            and their current status.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/disbursement-list")
                            }
                        >
                            View Disbursements
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Disbursement;