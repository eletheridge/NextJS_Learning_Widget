'use client'
import React, { useState } from 'react';
import {RFQ, RFQList} from './RFQList';
import QuoteGenerator from './QuoteGenerator';
import LocateInventory from './LocateInventory';


const QuotingWidget: React.FC = () => {
    const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);


    const handleRFQSelect = (rfq: RFQ | null) => {
        setSelectedRFQ(rfq); // Update the selected RFQ in the parent component when an RFQ is clicked
        setSelectedSupplierId(null); // Reset selected supplier when RFQ changes
    };

    const handleSupplierSelect = (supplierId: number | null) => {
        setSelectedSupplierId(supplierId);
    };

    // I labelled each div with a number to make it easier to follow along as I was writing the code
    // One: RFQ List, Two: Selected RFQ Details, Three: Locate Inventory, Price Details, Four: Quote Generator
    return (
        <div className={"card items-center"}>
            <div className="flex flex-col card w-7/12 glass drop-shadow-xl m-10 bg-base-100/25">
                <div className="flex flex-row">
                    {/* First Div: RFQ List */}
                    <RFQList onRFQSelect={handleRFQSelect} selectedRFQ={selectedRFQ} />

                    {/* Second Div: Display Selected RFQ Details */}
                    <div className="flex-1 p-4">
                        {selectedRFQ ? ( // Only display if an RFQ is selected
                            <div>
                                <h2 className={"pb-3 font-bold"}>Selected RFQ</h2>
                                <div className={"pb-3"}>
                                    <h3>Client: {selectedRFQ.client}</h3>
                                </div>
                                <ul>
                                    {selectedRFQ.products.map((product, index) => (
                                        <li key={index}>
                                            <p>Product ID: {product.productId}</p>
                                            <div style={{ marginLeft: '25px' }}>
                                                <p>Quantity: {product.quantity}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                <p>Select an RFQ to Continue</p>
                            </div>
                        )}
                    </div>

                    {/* Third Div: Display Locate Inventory, Price Details */}
                    <div className="flex-1 p-4">
                        {selectedRFQ && ( // Only display if an RFQ is selected
                            <LocateInventory selectedRFQ={selectedRFQ} onSupplierSelect={handleSupplierSelect} />
                        )}
                    </div>
                </div>

                {/* Fourth Div: Quote Generator */}
                <div className="flex items-center justify-center p-4 card-actions">
                    {selectedRFQ && selectedSupplierId !== null ? ( // Only display if an RFQ and supplier are selected
                        <QuoteGenerator selectedRFQ={selectedRFQ} selectedSupplierId={selectedSupplierId} />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default QuotingWidget;
