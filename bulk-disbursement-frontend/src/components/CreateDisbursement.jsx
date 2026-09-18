import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import "../css/CreateDisbursement.css";

function CreateDisbursement() {

    const navigate = useNavigate();

    // ==============================
    // Scheme
    // ==============================

    const [schemes, setSchemes] = useState([]);
    const [selectedScheme, setSelectedScheme] = useState("");

    // ==============================
    // Description
    // ==============================

    const [description, setDescription] = useState("");

    // ==============================
    // Amount
    // ==============================

    const [amount, setAmount] = useState("");

    // ==============================
    // Payees
    // ==============================

    const [payees, setPayees] = useState([]);
    const [selectedPayeeIds, setSelectedPayeeIds] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    // ==============================
    // Pagination
    // ==============================

    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    const [totalPages, setTotalPages] = useState(0);
    const [totalPayees, setTotalPayees] = useState(0);

    // ==============================
    // State
    // ==============================

    const [loadingSchemes, setLoadingSchemes] = useState(true);
    const [loadingPayees, setLoadingPayees] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // Load Schemes
    // =====================================================

    useEffect(() => {

        async function loadSchemes() {

            try {

                setLoadingSchemes(true);

                const response = await apiClient.get(
                    "/api/schemes"
                );

                setSchemes(response.data);

            } catch (error) {

                console.error(
                    "Failed to load schemes:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load schemes."
                );

            } finally {

                setLoadingSchemes(false);
            }
        }

        loadSchemes();

    }, []);

    // =====================================================
    // Load Payees
    // =====================================================

    useEffect(() => {

        async function loadPayees() {

            try {

                setLoadingPayees(true);

                const response = await apiClient.get(
                    "/api/payees",
                    {
                        params: {
                            page: currentPage,
                            size: pageSize
                        }
                    }
                );

                /*
                 * Supports Spring Page response.
                 */

                if (response.data.content) {

                    setPayees(
                        response.data.content
                    );

                    setTotalPages(
                        response.data.totalPages
                    );

                    setTotalPayees(
                        response.data.totalElements
                    );

                } else {

                    /*
                     * Temporary support for
                     * non-paginated API.
                     */

                    setPayees(response.data);

                    setTotalPayees(
                        response.data.length
                    );

                    setTotalPages(
                        Math.ceil(
                            response.data.length /
                            pageSize
                        )
                    );
                }

            } catch (error) {

                console.error(
                    "Failed to load payees:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load payees."
                );

            } finally {

                setLoadingPayees(false);
            }
        }

        loadPayees();

    }, [currentPage]);

    // =====================================================
    // Select Payee
    // =====================================================

    function handlePayeeSelection(payeeId) {

        setSelectedPayeeIds(previous => {

            const updated = new Set(previous);

            if (updated.has(payeeId)) {

                updated.delete(payeeId);

            } else {

                updated.add(payeeId);
            }

            return updated;
        });

        setSelectAll(false);
    }

    // =====================================================
    // Select All
    // =====================================================

    async function handleSelectAll() {

        setError("");

        if (selectAll) {

            setSelectedPayeeIds(new Set());
            setSelectAll(false);

            return;
        }

        try {

            /*
             * Temporary implementation.
             *
             * Later this will be handled by backend
             * for very large datasets.
             */

            const response = await apiClient.get(
                "/api/payees"
            );

            let allPayees;

            if (response.data.content) {

                allPayees = response.data.content;

            } else {

                allPayees = response.data;
            }

            const ids = new Set(
                allPayees.map(
                    payee => payee.id
                )
            );

            setSelectedPayeeIds(ids);
            setSelectAll(true);

        } catch (error) {

            console.error(
                "Failed to select all payees:",
                error
            );

            setError(
                "Unable to select all payees."
            );
        }
    }

    // =====================================================
    // Amount
    // =====================================================

    function handleAmountChange(event) {

        const value = event.target.value;

        if (
            value === "" ||
            /^\d+(\.\d{0,2})?$/.test(value)
        ) {
            setAmount(value);
        }
    }

    // =====================================================
    // Total Amount
    // =====================================================

    const totalAmount = useMemo(() => {

        return (
            selectedPayeeIds.size *
            (Number(amount) || 0)
        );

    }, [selectedPayeeIds, amount]);

    // =====================================================
    // Pagination
    // =====================================================

    function previousPage() {

        if (currentPage > 0) {

            setCurrentPage(
                currentPage - 1
            );
        }
    }

    function nextPage() {

        if (
            currentPage <
            totalPages - 1
        ) {

            setCurrentPage(
                currentPage + 1
            );
        }
    }

    // =====================================================
    // Submit
    // =====================================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");

        // ==============================
        // Validation
        // ==============================

        if (!selectedScheme) {

            setError(
                "Please select a scheme."
            );

            return;
        }

        if (!description.trim()) {

            setError(
                "Please enter a description."
            );

            return;
        }

        if (selectedPayeeIds.size === 0) {

            setError(
                "Please select at least one payee."
            );

            return;
        }

        if (
            !amount ||
            Number(amount) <= 0
        ) {

            setError(
                "Please enter a valid amount."
            );

            return;
        }

        // ==============================
        // Request
        // ==============================

        const request = {

            schemeId:
                Number(selectedScheme),

            description:
                description.trim(),

            payeeIds:
                Array.from(
                    selectedPayeeIds
                ),

            /*
             * Backend expects
             * amountPerPayee
             */

            amountPerPayee:
                Number(amount)
        };

        console.log(
            "Disbursement request:",
            request
        );

        // ==============================
        // API Call
        // ==============================

        try {

            setSubmitting(true);

            const response =
                await apiClient.post(
                    "/api/disbursements",
                    request
                );

            console.log(
                "Created disbursement:",
                response.data
            );

            setSuccess(
                "Disbursement created successfully."
            );

            // Reset form

            setSelectedScheme("");
            setDescription("");
            setAmount("");

            setSelectedPayeeIds(
                new Set()
            );

            setSelectAll(false);

        } catch (error) {

            console.error(
                "Failed to create disbursement:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to create disbursement."
            );

        } finally {

            setSubmitting(false);
        }
    }

    // =====================================================
    // Render
    // =====================================================

    return (

        <div className="create-disbursement-page">

            <div className="create-disbursement-container">

                {/* Header */}

                <div className="create-disbursement-header">

                    <div>

                        <h1>
                            Create Disbursement
                        </h1>

                        <p>
                            Create a bulk payment for
                            selected payees.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="back-button"
                        onClick={() =>
                            navigate("/disbursements")
                        }
                    >
                        Back
                    </button>

                </div>

                {/* Error */}

                {error && (

                    <div className="disbursement-error">
                        {error}
                    </div>

                )}

                {/* Success */}

                {success && (

                    <div className="disbursement-success">
                        {success}
                    </div>

                )}

                <form onSubmit={handleSubmit}>

                    {/* =================================
                        DISBURSEMENT DETAILS
                    ================================= */}

                    <div className="create-section">

                        <h2>
                            Disbursement Details
                        </h2>

                        {/* Scheme */}

                        <div className="form-group">

                            <label>

                                Scheme

                                <span>*</span>

                            </label>

                            <select
                                value={selectedScheme}
                                onChange={event =>
                                    setSelectedScheme(
                                        event.target.value
                                    )
                                }
                                disabled={loadingSchemes}
                            >

                                <option value="">

                                    {loadingSchemes
                                        ? "Loading schemes..."
                                        : "Select Scheme"}

                                </option>

                                {schemes.map(
                                    scheme => (

                                        <option
                                            key={scheme.id}
                                            value={scheme.id}
                                        >

                                            {scheme.schemeCode}
                                            {" - "}
                                            {scheme.schemeName}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        {/* Description */}

                        <div className="form-group">

                            <label>

                                Description

                                <span>*</span>

                            </label>

                            <textarea
                                value={description}
                                onChange={event =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter disbursement description"
                                rows="4"
                            />

                        </div>

                    </div>

                    {/* =================================
                        PAYEES
                    ================================= */}

                    <div className="create-section">

                        <div className="payee-section-header">

                            <div>

                                <h2>
                                    Select Payees
                                </h2>

                                <p>
                                    Select payees who will
                                    receive the payment.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="select-all-button"
                                onClick={
                                    handleSelectAll
                                }
                            >

                                {selectAll
                                    ? "Unselect All"
                                    : "Select All Payees"}

                            </button>

                        </div>

                        {/* Selection Count */}

                        <div className="selection-count">

                            <strong>
                                {selectedPayeeIds.size}
                            </strong>

                            <span>
                                payee(s) selected
                            </span>

                        </div>

                        {/* Payee Table */}

                        {loadingPayees ? (

                            <div className="table-message">
                                Loading payees...
                            </div>

                        ) : payees.length === 0 ? (

                            <div className="table-message">
                                No payees available.
                            </div>

                        ) : (

                            <>

                                <div className="payee-table-container">

                                    <table>

                                        <thead>

                                            <tr>

                                                <th>
                                                    Select
                                                </th>

                                                <th>
                                                    Name
                                                </th>

                                                <th>
                                                    Email
                                                </th>

                                                <th>
                                                    PAN
                                                </th>

                                                <th>
                                                    Account
                                                </th>

                                                <th>
                                                    Bank
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {payees.map(
                                                payee => (

                                                    <tr
                                                        key={
                                                            payee.id
                                                        }
                                                    >

                                                        <td>

                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    selectedPayeeIds.has(
                                                                        payee.id
                                                                    )
                                                                }
                                                                onChange={() =>
                                                                    handlePayeeSelection(
                                                                        payee.id
                                                                    )
                                                                }
                                                            />

                                                        </td>

                                                        <td>

                                                            {
                                                                payee.firstName
                                                            }{" "}

                                                            {
                                                                payee.lastName
                                                            }

                                                        </td>

                                                        <td>

                                                            {
                                                                payee.email
                                                            }

                                                        </td>

                                                        <td>

                                                            {payee.panNumber
                                                                ? `XXXXX${payee.panNumber.slice(-5)}`
                                                                : "-"}

                                                        </td>

                                                        <td>

                                                            {payee.accountNumber
                                                                ? `******${payee.accountNumber.slice(-4)}`
                                                                : "-"}

                                                        </td>

                                                        <td>

                                                            {
                                                                payee.bankName
                                                            }

                                                        </td>

                                                        <td>

                                                            <span
                                                                className={`status-badge ${
                                                                    payee.status?.toLowerCase()
                                                                }`}
                                                            >

                                                                {
                                                                    payee.status
                                                                }

                                                            </span>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                                {/* Pagination */}

                                <div className="pagination">

                                    <button
                                        type="button"
                                        onClick={
                                            previousPage
                                        }
                                        disabled={
                                            currentPage === 0
                                        }
                                    >
                                        Previous
                                    </button>

                                    <span>

                                        Page{" "}

                                        <strong>
                                            {currentPage + 1}
                                        </strong>

                                        {" "}of{" "}

                                        <strong>
                                            {totalPages || 1}
                                        </strong>

                                    </span>

                                    <button
                                        type="button"
                                        onClick={
                                            nextPage
                                        }
                                        disabled={
                                            currentPage >=
                                            totalPages - 1
                                        }
                                    >
                                        Next
                                    </button>

                                </div>

                                <div className="total-payees">

                                    Total payees:{" "}

                                    <strong>
                                        {totalPayees}
                                    </strong>

                                </div>

                            </>

                        )}

                    </div>

                    {/* =================================
                        PAYMENT AMOUNT
                    ================================= */}

                    <div className="create-section">

                        <h2>
                            Payment Amount
                        </h2>

                        <div className="form-group amount-group">

                            <label>

                                Amount per Payee

                                <span>*</span>

                            </label>

                            <div className="amount-input">

                                <span>
                                    ₹
                                </span>

                                <input
                                    type="text"
                                    value={amount}
                                    onChange={
                                        handleAmountChange
                                    }
                                    placeholder="Enter amount"
                                />

                            </div>

                            <small>

                                The same amount will currently
                                be paid to every selected payee.

                            </small>

                        </div>

                    </div>

                    {/* =================================
                        SUMMARY
                    ================================= */}

                    <div className="disbursement-summary">

                        <div>

                            <span>
                                Selected Payees
                            </span>

                            <strong>
                                {
                                    selectedPayeeIds.size
                                }
                            </strong>

                        </div>

                        <div>

                            <span>
                                Amount per Payee
                            </span>

                            <strong>

                                ₹{" "}

                                {(
                                    Number(amount) || 0
                                ).toLocaleString(
                                    "en-IN"
                                )}

                            </strong>

                        </div>

                        <div className="total-row">

                            <span>
                                Total Disbursement
                            </span>

                            <strong>

                                ₹{" "}

                                {totalAmount.toLocaleString(
                                    "en-IN"
                                )}

                            </strong>

                        </div>

                    </div>

                    {/* Submit */}

                    <div className="form-actions">

                        <button
                            type="submit"
                            className="create-button"
                            disabled={submitting}
                        >

                            {submitting
                                ? "Creating..."
                                : "Create Disbursement"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CreateDisbursement;