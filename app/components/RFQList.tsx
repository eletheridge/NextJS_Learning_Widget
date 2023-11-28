import React, { useState } from 'react';
import {mockRFQs} from "@/app/components/mockData";

export interface RFQ {  // Interface for the structure of an RFQ which would be returned from a DB call
    id: number;
    client: string;  // Would be a client object in production with more details
    products: { productId: number; quantity: number }[];
}
interface RFQListProps {  // Interface for the properties passed to the RFQList component
    onRFQSelect: (rfq: RFQ | null) => void;
    selectedRFQ: RFQ | null;
}

export const RFQList: React.FC<RFQListProps> = ({ onRFQSelect,selectedRFQ }) => {
    const [clientSearch, setClientSearch] = useState('');
    const [filteredRFQs, setFilteredRFQs] = useState<RFQ[]>([]);

    const handleInputChange = (value: string) => {

        // In production, I would use an async call up front when the component is loaded to the DB and cache all RFQs
        // to avoid making a DB call on every input change
        // Such calls would not only be costly, but they would also be slow and cause the UI to lag

        // Update the input value and filter the RFQs in real-time
        setClientSearch(value);

        // When all input is deleted from the box, reset the filtered RFQs and selected RFQ
        if (value === '') {
            setFilteredRFQs([]);
            onRFQSelect(null); // Reset the selected RFQ in the parent component
        } else {
            // Filter and set the RFQs for the entered client in real-time
            const clientFilteredRFQs = mockRFQs.filter((rfq) =>
                rfq.client.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredRFQs(clientFilteredRFQs);
        }
    };

    const handleRFQClick = (rfq: RFQ) => {
        onRFQSelect(rfq); // Update the selected RFQ in the parent component when an RFQ is clicked
    };

    return (
        <div className="p-4">
            <h2 className={"pb-3 font-bold"}>Look Up Existing RFQs</h2>
            <input // Search box updates in real-time as the user types
                type="text"
                placeholder={'Enter Client Name'}
                value={clientSearch}
                className={"border-1 border-gray-300 rounded-md p-1"}
                onChange={(e) => handleInputChange(e.target.value)}
            />
            <ul>
                {filteredRFQs.map((rfq) => (
                    <li
                        key={rfq.id}
                        className={`hover:cursor-pointer ${selectedRFQ === rfq ? 'bg-blue-200' : ''}`}
                        onClick={() => handleRFQClick(rfq)}
                    >
                        {rfq.client} (RFQ ID: {rfq.id})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RFQList;
