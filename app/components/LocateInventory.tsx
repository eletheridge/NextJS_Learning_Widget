import React, { useState, useEffect } from 'react';
import { RFQ } from './RFQList';
import { mockSuppliers } from './mockData'; // See block comment below for more details

interface LocateInventoryProps {
    selectedRFQ: RFQ | null;
    onSupplierSelect: (supplierId: number | null) => void; // Can be null to handle the list of suppliers being reset by other components
}

export interface Supplier { // Interface for the structure of a supplier which would be returned from DB or API call.
    id: number;
    name: string;
    inventory: { productId: number; quantity: number; price: number; leadTimeTemplate: string }[];
}

const LocateInventory: React.FC<LocateInventoryProps> = ({ selectedRFQ, onSupplierSelect }) => {
    const [availableSuppliers, setAvailableSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

    // This functionality is the hardest to be sure about in a production environment.
    // An assumption that could be made is that the suppliers are known and stored in the DB.
    // However, the prices and inventory levels are subject to change.  This could be handled one of some ways.
    // 1. The prices and inventory levels could be stored in the DB and updated periodically.
    // 2. The prices and inventory levels could be stored in the DB and updated on-demand.
    // 3. The prices and inventory levels are not stored in the DB and are retrieved from an API call.
    // 4. All supplier details are retrieved from an API call.
    // For this particular implementation, I am treating the information as if it's all retrieved from an API call
    // in JSON format for simplicity.

    useEffect(() => {
        if (selectedRFQ) { // We only want this to be triggered when an RFQ is selected

            // Filter suppliers based on having enough inventory for the entire RFQ.
            // If we really wanted to get complex, and we wanted to allow for multiple suppliers per RFQ,
            // we could filter the suppliers based on having enough inventory for each individual product in the RFQ.

            const suppliersWithFullInventory = mockSuppliers.filter((supplier) =>
                selectedRFQ.products.every((product) => {
                    const supplierInventoryItem = supplier.inventory.find((item) => item.productId === product.productId);
                    return supplierInventoryItem && supplierInventoryItem.quantity >= product.quantity;
                })
            );
            setAvailableSuppliers(suppliersWithFullInventory);
        } else {
            setAvailableSuppliers([]); // Reset the list of suppliers when no RFQ is selected
        }
    }, [selectedRFQ]);

    function handleSupplierSelect(supplierId: number | null) {
        onSupplierSelect(supplierId); // Update the selected supplier in the parent component when a supplier is clicked
        setSelectedSupplierId(supplierId); // Update the selected supplier in this component
    }

    return (
        <>
            <div>
                <h2 className={"pb-3 font-bold"}>Locate Inventory</h2>
                <div className={"pb-2"}>
                    <select onChange={(e) => handleSupplierSelect(parseInt(e.target.value, 10) || null)}>
                        <option value={0}>Select a Supplier</option>
                        {availableSuppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {selectedSupplierId && selectedRFQ &&
                <>
                    <h3>Selected Supplier:</h3>
                    <div style={{marginLeft: '25px'}} className={"pb-3"}>
                        <h3>{mockSuppliers.find((supplier) => supplier.id === selectedSupplierId)?.name}</h3>
                    </div>
                    <ul>
                        {mockSuppliers
                            .find((supplier) => supplier.id === selectedSupplierId)
                            ?.inventory.filter((item) =>
                                selectedRFQ.products.some(
                                    (product) =>
                                        product.productId === item.productId && product.quantity <= item.quantity
                                )
                            )
                            .map((item) => (
                                <li key={item.productId}>
                                    Product ID {item.productId} -- {item.name}
                                    <div className={"pb-2"} style={{marginLeft: '25px'}}>
                                        <p>Price: {item.price}</p>
                                        <p>Lead Time: {item.leadTimeTemplate} days</p>
                                        <p>Quantity: {item.quantity}</p>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </>
            }
        </>
    );
};

export default LocateInventory;
