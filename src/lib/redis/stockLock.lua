-- Redis Lua Script for Atomic 2-Phase Stock Reservation
-- Eliminates race conditions in flash sales under high concurrent traffic

-- KEYS[1]: stock_key (e.g. "stock:prod_123:var_456")
-- KEYS[2]: reservation_key (e.g. "res:res_uuid_999")
-- ARGV[1]: requested_quantity
-- ARGV[2]: ttl_seconds (e.g. 600 for 10 minutes)
-- ARGV[3]: user_id

local stock_key = KEYS[1]
local reservation_key = KEYS[2]
local req_qty = tonumber(ARGV[1])
local ttl = tonumber(ARGV[2])
local user_id = ARGV[3]

local total_stock = tonumber(redis.call('HGET', stock_key, 'total_stock') or 0)
local reserved_stock = tonumber(redis.call('HGET', stock_key, 'reserved_stock') or 0)

local available = total_stock - reserved_stock

if available >= req_qty then
    -- Atomically increase reserved stock
    redis.call('HINCRBY', stock_key, 'reserved_stock', req_qty)
    
    -- Store reservation record with expiry
    redis.call('HMSET', reservation_key, 'quantity', req_qty, 'user_id', user_id, 'stock_key', stock_key)
    redis.call('EXPIRE', reservation_key, ttl)
    
    -- Return success status and new available balance
    return { 1, available - req_qty }
else
    -- Insufficient stock
    return { 0, available }
end
