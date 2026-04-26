IF COL_LENGTH('tblAdmin', 'photo') IS NULL
BEGIN
    ALTER TABLE tblAdmin
    ADD photo NVARCHAR(255) NULL;
END;