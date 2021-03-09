EXPLAIN

SELECT 
	orders.*, 
 CONCAT(orders.klient_name, ',<br />', orders.tochka_name) as full_name, 
CONCAT(orders.city, ',<br />',  orders.adres) as full_adres, 
orders_exec.executed as executed, 
orders_exec.not_executed as not_executed, 
orders_exec.exec_time as exec_time, 
orders_exec.exec_datetime as exec_datetime, 
orders_exec.exec_prim as exec_prim, 
orders_exec.exec_money as exec_money, 
IFNULL(orders_p.photos_count, 0) AS order_photos_count,
IFNULL(clients_p.photos_count, 0) AS client_photos_count,
IFNULL(orders_c.coords_count, 0) AS client_coords_count
FROM orders 

 LEFT JOIN orders_exec 
 ON orders.routelist_id = orders_exec.routelist_id AND orders.order_id = orders_exec.order_id 
 
LEFT JOIN ( 
 SELECT order_id, routelist_id, COUNT(*) AS coords_count 
 FROM orders_coords 
 GROUP BY orders_coords.update_time) AS orders_c 
 ON orders.routelist_id = orders_exec.routelist_id AND orders.order_id = orders_c.order_id 

LEFT JOIN ( 
 SELECT client_id, tochka_id, COUNT(*) AS photos_count 
 FROM clients_photos 
 GROUP BY clients_photos.client_id, clients_photos.tochka_id) AS clients_p 
 ON orders.klient_id = clients_p.client_id AND  
 (orders.tochka_id = clients_p.tochka_id OR orders.tochka_id = '00000000-0000-0000-0000-000000000000') 

 LEFT JOIN ( 
 SELECT order_id, routelist_id, COUNT(*) AS photos_count 
 FROM orders_photos 
 GROUP BY orders_photos.id) AS orders_p 
 ON orders.routelist_id = orders_p.routelist_id AND orders.order_id = orders_p.order_id 

 WHERE orders.routelist_id = '57f7f8be-7bf9-11eb-aba4-309c23b04267'
 ORDER BY orders.num_in_routelist