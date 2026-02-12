insert into public.purchased_orders (PO, supplier, transaction_date, deliveryDate, total, approvalstatus, deliverystatus, paymentstatus, remarks, quantity, items)
values (
  'PO-123142',
  'Javier Meats',
  '2025-12-27',
  null,
  1.00,
  'Pending',
  'Order Placed',
  'N/A',
  'test',
  1,
  '[{"brand":"test","type":"Standard Items","quantity":1,"unitPrice":1,"total":1,"Discount":1,"Shipping":1,"id":1766797697035}]'
);
