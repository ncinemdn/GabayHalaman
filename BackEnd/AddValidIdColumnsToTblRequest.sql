IF COL_LENGTH('tblRequest', 'valid_id_attachment') IS NULL
BEGIN
    ALTER TABLE tblRequest
    ADD valid_id_attachment NVARCHAR(MAX) NULL;
END;

IF COL_LENGTH('tblRequest', 'valid_id_file_name') IS NULL
BEGIN
    ALTER TABLE tblRequest
    ADD valid_id_file_name NVARCHAR(255) NULL;
END;

IF COL_LENGTH('tblRequest', 'valid_id_content_type') IS NULL
BEGIN
    ALTER TABLE tblRequest
    ADD valid_id_content_type NVARCHAR(100) NULL;
END;