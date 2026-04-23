-- Stored Procedure for Client Delivery Window
-- This procedure calculates the earliest and latest delivery dates for a specific client

CREATE PROCEDURE SP_GetClientDeliveryWindow
    @client_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        c.full_name,
        MIN(s.scheduled_date) AS EarliestDelivery,
        MAX(s.scheduled_date) AS LatestDelivery
    FROM Client c
    INNER JOIN Request r ON c.client_id = r.client_id
    INNER JOIN Schedule s ON r.request_id = s.request_id
    WHERE s.fulfillment_type = 'Delivery'
      AND c.client_id = @client_id
    GROUP BY c.full_name;
END;