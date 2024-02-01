# inventory_service
Inventory Management

This project is aimed at developing a simple inventory management system with following functionalities

1. Manage locations (stores and dc) and ON-HAND count for each item in each location - provide CRUD apis for locations and inventory
   
2. Query total onhand inventory and available inventory (available inventory = on-hand inventory - reserved inventory) for an item in group of locations or at a single location
   
3. Query total inventory ( Onhand inventory + inbound inventory from PO and ASN ) for a given future date.

4. Provide transactional APIs for following business functions 
    a. reserving inventory at a location, 
    b. receiving inventory at a location from inbound PO ASN from DC or Vendor, 
    c. receiving inventory at a location from inbound TO(transfer orders from another store) 
    d. transfering inventory out of a location and crate Transfer order to track transfers 
    e. fulfill order and remove reservation from a location ( reduce on-hand inventory 
