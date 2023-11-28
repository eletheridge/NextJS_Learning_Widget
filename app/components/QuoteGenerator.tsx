// components/QuoteGenerator.tsx

import React, { useState } from 'react';
import { RFQ } from './RFQList';
import { mockSuppliers } from './mockData'; // In production, this data will have been retrieved by LocateInventory.tsx

interface QuoteGeneratorProps {
    selectedRFQ: RFQ | null;
    selectedSupplierId: number | null;
}

const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ selectedRFQ, selectedSupplierId }) => {
    const [quote, setQuote] = useState<React.ReactElement | null>(null);

    const generateQuote = () => {
        if (selectedRFQ && selectedSupplierId !== null) {
            const supplier = mockSuppliers.find((s) => s.id === selectedSupplierId);

            if (supplier) { // This check is just to be safe, but it should never be false.
                const quoteItems = selectedRFQ.products.map((product, index) => {
                    const inventoryItem = supplier.inventory.find((item) => item.productId === product.productId);
                    const unitPrice = inventoryItem ? inventoryItem.price : 0;

                    return (
                        <tr key={index}>
                            <td>{product.productId}</td>
                            <td>{product.quantity}</td>
                            <td>{inventoryItem?.name}</td>
                            <td>${unitPrice}</td>
                        </tr>
                    );
                });

                const totalLeadTime = Math.max( // The lead time for the quote is the longest lead time of all products in the RFQ
                    ...selectedRFQ.products.map((product) => {
                        const inventoryItem = supplier.inventory.find((item) => item.productId === product.productId);
                        return inventoryItem ? parseInt(inventoryItem.leadTimeTemplate, 10) : 0;
                    })
                );

                const totalQuotePrice = selectedRFQ.products.reduce((total, product) => { // The total price is the sum of all products in the RFQ
                    const inventoryItem = supplier.inventory.find((item) => item.productId === product.productId);
                    const unitPrice = inventoryItem ? inventoryItem.price : 0;
                    return total + unitPrice * product.quantity;
                }, 0);

                setQuote( // Define the table to display the preview of the quote
                    <div className={"flex flex-col items-center justify-center"}>
                        <h2>Quote Preview</h2>
                        <table className={"table"}>
                            <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Quantity Requested</th>
                                <th>Product Name</th>
                                <th>Unit Price</th>
                            </tr>
                            </thead>
                            <tbody>{quoteItems}</tbody>
                        </table>
                        <div>
                            <div>Lead Time: {totalLeadTime} days</div>
                            <div>Total Price: ${totalQuotePrice}</div>
                        </div>
                    </div>
                );
            }
            // In a production environment, There would likely be much more logic here.  For example, we might want to
            // generate a PDF of the quote, or we might want to email the client with the quote, and we likely
            // want to store the quote in the DB for a set period of time.  But for the sake of this exercise, I am
            // just displaying the quote in the UI.
        }
    };

    return (
        <div>
            {selectedRFQ && selectedSupplierId !== null && ( // Only display the quote button when an RFQ and supplier are selected
                <div className={"flex flex-col items-center justify-center"}>
                    <button className={"btn btn-primary"} onClick={generateQuote}>
                        Generate Quote
                    </button>
                    <div className={"pt-8"}>{quote}</div>
                </div>
            )}
        </div>
    );
};

export default QuoteGenerator;
