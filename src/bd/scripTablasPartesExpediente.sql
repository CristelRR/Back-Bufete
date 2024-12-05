-- Verificar tablas existentes
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE';

-- Eliminar tablas existentes en el orden correcto debido a dependencias
DROP TABLE IF EXISTS tblDocumentosExpediente;
DROP TABLE IF EXISTS tblHistorialExpediente;
DROP TABLE IF EXISTS tblHistorialDocumentosExpediente;
DROP TABLE IF EXISTS tblTercerosRelacionados;
DROP TABLE IF EXISTS tblParteDemandada;
DROP TABLE IF EXISTS tblParteDemandante;
DROP TABLE IF EXISTS tblSubCategoriasDocumento;
DROP TABLE IF EXISTS tblCategoriasDocumento;
DROP TABLE IF EXISTS tblExpediente;


-- Crear la tabla tblCategoriasDocumento
CREATE TABLE tblCategoriasDocumento (
    idCategoria INT IDENTITY(1,1) PRIMARY KEY,
    nombreCategoria NVARCHAR(100) NOT NULL UNIQUE,
    descripcion NVARCHAR(255) NOT NULL -- Agregamos descripción para las categorías
);

CREATE TABLE tblSubCategoriasDocumento (
    idSubCategoria INT IDENTITY(1,1) PRIMARY KEY,
    idCategoriaFK INT NOT NULL,
    nombreSubCategoria NVARCHAR(100) NOT NULL UNIQUE,
    descripcion NVARCHAR(255) NOT NULL, -- Agregamos descripción para las subcategorías
    FOREIGN KEY (idCategoriaFK) REFERENCES tblCategoriasDocumento(idCategoria) ON DELETE CASCADE
);

-- Crear la tabla tblExpediente
CREATE TABLE tblExpediente (
    idExpediente INT IDENTITY(1,1) PRIMARY KEY,
    numeroExpediente VARCHAR(50) NOT NULL UNIQUE,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('abierto', 'proceso', 'cerrado')),
    descripcion NVARCHAR(500),
    nombreExpediente NVARCHAR(100) NOT NULL DEFAULT 'Nombre por Defecto',
    anioExpediente INT NOT NULL DEFAULT YEAR(GETDATE()),
    idClienteFK INT NOT NULL,
    idEmpleadoFK INT NULL,
    FOREIGN KEY (idClienteFK) REFERENCES tblCliente(idCliente) ON DELETE CASCADE,
    FOREIGN KEY (idEmpleadoFK) REFERENCES tblEmpleado(idEmpleado) ON DELETE SET NULL
);

-- Crear la tabla tblDocumentosExpediente
CREATE TABLE tblDocumentosExpediente (
    idDocumento INT IDENTITY(1,1) PRIMARY KEY,
    idExpedienteFK INT NOT NULL,
    idSubCategoriaFK INT NOT NULL,
    fechaSubida DATETIME NOT NULL DEFAULT GETDATE(),
    estado VARCHAR(20) NOT NULL DEFAULT 'En Revisión' CHECK (estado IN ('En Revisión', 'Aprobado', 'Rechazado', 'Pendiente de Corrección')),
    documentoBase64 TEXT NOT NULL,
    FOREIGN KEY (idExpedienteFK) REFERENCES tblExpediente(idExpediente) ON DELETE CASCADE,
    FOREIGN KEY (idSubCategoriaFK) REFERENCES tblSubCategoriasDocumento(idSubCategoria)
);

-- Crear la tabla tblHistorialExpediente
CREATE TABLE tblHistorialExpediente (
    idHistorialExpediente INT IDENTITY(1,1) PRIMARY KEY,
    idExpedienteOriginal INT NOT NULL,
    numeroExpediente NVARCHAR(50) NOT NULL,
    nombreExpediente NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(500),
    estado NVARCHAR(20) NOT NULL CHECK (estado IN ('abierto', 'proceso', 'cerrado')),
    fechaCreacion DATETIME NOT NULL,
    fechaEliminacion DATETIME DEFAULT GETDATE(),
    responsableEliminacion NVARCHAR(100),
    idClienteFK INT,
    idEmpleadoFK INT
);

-- Crear la tabla tblHistorialDocumentosExpediente
CREATE TABLE tblHistorialDocumentosExpediente (
    idHistorialDocumento INT IDENTITY(1,1) PRIMARY KEY,
    idExpedienteHistorialFK INT NOT NULL,
    idSubCategoriaFK INT NOT NULL,
    fechaSubida DATETIME NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('En Revisión', 'Aprobado', 'Rechazado', 'Pendiente de Corrección')),
    documentoBase64 TEXT NOT NULL,
    responsable NVARCHAR(100),
    FOREIGN KEY (idExpedienteHistorialFK) REFERENCES tblHistorialExpediente(idHistorialExpediente),
    FOREIGN KEY (idSubCategoriaFK) REFERENCES tblSubCategoriasDocumento(idSubCategoria)
);

-- Crear la tabla tblParteDemandante
CREATE TABLE tblParteDemandante (
    idParteDemandante INT IDENTITY(1,1) PRIMARY KEY,
    idExpedienteFK INT NOT NULL,
    relacionCaso NVARCHAR(255),
    nombreCompleto NVARCHAR(255) NOT NULL,
    identificacionOficial NVARCHAR(100),
    fechaNacimiento DATE,
    domicilio NVARCHAR(255),
    telefono NVARCHAR(20),
    correo NVARCHAR(100),
    representanteLegalNombre NVARCHAR(255),
    numeroLicencia VARCHAR(50),
    representanteLegalTelefono NVARCHAR(20),
    representanteLegalCorreo NVARCHAR(100),
    FOREIGN KEY (idExpedienteFK) REFERENCES tblExpediente(idExpediente) ON DELETE CASCADE
);

-- Crear la tabla tblParteDemandada
CREATE TABLE tblParteDemandada (
    idParteDemandada INT IDENTITY(1,1) PRIMARY KEY,
    idExpedienteFK INT NOT NULL,
    relacionCaso NVARCHAR(255),
    nombreCompleto NVARCHAR(255) NOT NULL,
    identificacionOficial NVARCHAR(100),
    fechaNacimiento DATE,
    domicilio NVARCHAR(255),
    telefono NVARCHAR(20),
    correo NVARCHAR(100),
    representanteLegalNombre NVARCHAR(255),
    representanteLegalCedula NVARCHAR(100),
    representanteLegalTelefono NVARCHAR(20),
    representanteLegalCorreo NVARCHAR(100),
    FOREIGN KEY (idExpedienteFK) REFERENCES tblExpediente(idExpediente) ON DELETE CASCADE
);

-- Crear la tabla tblTercerosRelacionados
CREATE TABLE tblTercerosRelacionados (
    idTerceroRelacionado INT IDENTITY(1,1) PRIMARY KEY,
    idExpedienteFK INT NOT NULL,
    relacionCaso NVARCHAR(255),
    nombreCompleto NVARCHAR(255) NOT NULL,
    identificacionOficial NVARCHAR(100),
    fechaNacimiento DATE,
    domicilio NVARCHAR(255),
    telefono NVARCHAR(20),
    correo NVARCHAR(100),
    FOREIGN KEY (idExpedienteFK) REFERENCES tblExpediente(idExpediente) ON DELETE CASCADE
);



-- Procedimiento para actualizar estado de documentos
ALTER PROCEDURE sp_actualizar_estado_documento
    @idDocumento INT,
    @nuevoEstado NVARCHAR(20),
    @comentarios NVARCHAR(255) = NULL,
    @responsable NVARCHAR(100)
AS
BEGIN
    UPDATE tblDocumentosExpediente
    SET estado = @nuevoEstado
    WHERE idDocumento = @idDocumento;

    INSERT INTO tblHistorialDocumentosExpediente (
        idExpedienteHistorialFK, idSubCategoriaFK, fechaSubida, estado, documentoBase64, responsable
    )
    SELECT
        idExpedienteFK, idSubCategoriaFK, fechaSubida, @nuevoEstado, documentoBase64, @responsable
    FROM tblDocumentosExpediente
    WHERE idDocumento = @idDocumento;
END;


-- Trigger para registrar cambios en tblExpediente
CREATE TRIGGER trg_historial_expediente
ON tblExpediente
AFTER UPDATE, DELETE
AS
BEGIN
    INSERT INTO tblHistorialExpediente (
        idExpedienteOriginal, numeroExpediente, nombreExpediente, descripcion, estado, fechaCreacion, 
        fechaEliminacion, responsableEliminacion, idClienteFK, idEmpleadoFK
    )
    SELECT
        DELETED.idExpediente, DELETED.numeroExpediente, DELETED.nombreExpediente, DELETED.descripcion, 
        DELETED.estado, GETDATE(), GETDATE(), SYSTEM_USER, DELETED.idClienteFK, DELETED.idEmpleadoFK
    FROM DELETED;
END;



-- Insertar datos en tblCategoriasDocumento
INSERT INTO tblCategoriasDocumento (nombreCategoria, descripcion)
VALUES 
    ('Contratos y Acuerdos Iniciales', 'Documentos relacionados con acuerdos iniciales y contratos legales'),
    ('Escritos Presentados', 'Documentos legales presentados ante tribunales u otras instancias'),
    ('Pruebas Documentales', 'Documentos que actúan como pruebas en el caso'),
    ('Resoluciones Judiciales y Notificaciones', 'Resoluciones oficiales emitidas por las autoridades'),
    ('Peritajes y Declaraciones', 'Informes técnicos o declaraciones relevantes al caso'),
    ('Evidencias Adicionales', 'Evidencias complementarias para apoyar el caso'),
    ('Correspondencia Oficial', 'Comunicación oficial entre las partes o con el tribunal'),
    ('Referencias Legales', 'Material legal relacionado como leyes, reglamentos y jurisprudencias');

SELECT * FROM tblCategoriasDocumento

-- Insertar datos en tblSubCategoriasDocumento
INSERT INTO tblSubCategoriasDocumento (idCategoriaFK, nombreSubCategoria, descripcion)
VALUES 
    -- Contratos y Acuerdos Iniciales
    (1, 'Contrato de prestación de servicios legales', 'Documento que formaliza el acuerdo de prestación de servicios'),
    (1, 'Contrato de mediación o arbitraje', 'Acuerdo para resolver conflictos mediante mediación o arbitraje'),
    (1, 'Acuerdo de confidencialidad firmado por las partes', 'Documento que garantiza la confidencialidad del caso'),
    (1, 'Convenios previos entre las partes involucradas', 'Acuerdos preliminares antes de iniciar procedimientos legales'),
    (1, 'Poderes notariales otorgados al abogado o representantes legales', 'Poderes otorgados para representar a las partes legalmente'),
    (1, 'Acuerdos preliminares para resolver el caso fuera de juicio', 'Acuerdos iniciales que buscan evitar procesos legales'),

    -- Escritos Presentados
    (2, 'Demanda inicial presentada en el juzgado', 'Primera demanda presentada por el demandante'),
    (2, 'Contestación a la demanda por parte del demandado', 'Respuesta formal del demandado a la demanda'),
    (2, 'Escritos de ampliación de demanda o reconvenciones', 'Documentos adicionales relacionados con la demanda'),
    (2, 'Recursos de apelación, amparo, o nulidad', 'Recursos legales para cuestionar decisiones judiciales'),
    (2, 'Alegatos presentados por las partes', 'Argumentos legales presentados por las partes en el caso'),
    (2, 'Escritos de desistimiento o acuerdos de resolución alternativa', 'Documentos relacionados con acuerdos para resolver el caso'),
    (2, 'Solicitudes de prórrogas, aclaraciones o correcciones', 'Peticiones de tiempo adicional o ajustes en documentos'),

    -- Pruebas Documentales
    (3, 'Contratos relacionados con el caso', 'Documentos contractuales relacionados con el caso'),
    (3, 'Actas notariales, de asamblea o constitutivas', 'Actas oficiales que respaldan el caso'),
    (3, 'Escrituras públicas de bienes inmuebles', 'Documentos que prueban la propiedad de bienes inmuebles'),
    (3, 'Correspondencia relevante', 'Cartas, mensajes o correos electrónicos relevantes'),
    (3, 'Facturas, recibos, comprobantes de pago', 'Pruebas financieras relacionadas con el caso'),
    (3, 'Registros financieros o contables', 'Documentos financieros relevantes al caso'),
    (3, 'Actas de matrimonio, nacimiento o defunción', 'Actas civiles relevantes al caso'),
    (3, 'Informes o reportes administrativos', 'Informes que apoyan el caso'),
    (3, 'Declaraciones juradas de las partes', 'Declaraciones bajo juramento presentadas por las partes'),

    -- Resoluciones Judiciales y Notificaciones
    (4, 'Autos iniciales del juzgado', 'Primera resolución oficial emitida por el juzgado'),
    (4, 'Sentencias interlocutorias y definitivas', 'Decisiones judiciales sobre el caso'),
    (4, 'Notificaciones oficiales enviadas o recibidas por las partes', 'Notificaciones emitidas por el tribunal'),
    (4, 'Acuerdos emitidos por el juzgado', 'Acuerdos ordenados por el tribunal'),
    (4, 'Citaciones judiciales para audiencias o comparecencias', 'Citaciones para audiencias'),
    (4, 'Resoluciones sobre incidentes procesales', 'Decisiones relacionadas con incidentes procesales'),

    -- Peritajes y Declaraciones
    (5, 'Informes periciales en diversas áreas', 'Informes técnicos que apoyan el caso'),
    (5, 'Declaraciones escritas de testigos o terceros relacionados', 'Testimonios escritos de terceros'),

    -- Evidencias Adicionales
    --(6, 'Copias de artículos relevantes de leyes o reglamentos aplicables al caso', 'Material legal adicional'),
    --(6, 'Jurisprudencia que respalde los argumentos legales', 'Casos legales previos relevantes al caso'),
    --(6, 'Opiniones legales emitidas por especialistas o expertos externos', 'Consultas con expertos legales'),
    --(6, 'Reglamentos internos de instituciones relacionadas', 'Reglamentos específicos relevantes'),
    --(6, 'Tratados internacionales', 'Acuerdos internacionales aplicables'),

    -- Correspondencia Oficial
    (7, 'Cartas enviadas al juzgado, contrapartes, o terceros', 'Cartas oficiales relacionadas al caso'),
    (7, 'Notificaciones enviadas o recibidas por correo o mensajería', 'Notificaciones entregadas por correo'),
    (7, 'Actas de reuniones con las partes o autoridades', 'Actas oficiales de reuniones'),
    (7, 'Correos electrónicos relacionados con el caso', 'Evidencia de comunicación electrónica'),
    (7, 'Constancias de entrega y recepción de documentos', 'Comprobantes de entrega y recepción de documentos'),

    -- Referencias Legales
    (8, 'Copias de artículos relevantes de leyes o reglamentos aplicables en caso', 'Material legal adicional'),
    (8, 'Jurisprudencia que respalde los argumentos legales', 'Casos legales previos relevantes al caso'),
    (8, 'Opiniones legales emitidas por especialistas o expertos externos', 'Consultas con expertos legales'),
    (8, 'Reglamentos internos de instituciones relacionadas', 'Reglamentos específicos relevantes'),
    (8, 'Tratados internacionales', 'Acuerdos internacionales aplicables');


-- Insertar datos en tblExpediente
INSERT INTO tblExpediente (numeroExpediente, estado, descripcion, nombreExpediente, idClienteFK, idEmpleadoFK)
VALUES 
    ('EXP0001', 'abierto', 'Caso de prueba inicial', 'Expediente Prueba 1', 100006, 1003)

-- Insertar datos en tblDocumentosExpediente
INSERT INTO tblDocumentosExpediente (idExpedienteFK, idSubCategoriaFK, documentoBase64)
VALUES 
    (1, 1, 'BASE64DATA_CONTRATO'),
    (1, 2, 'BASE64DATA_MEDIACION');

-- Insertar datos en tblHistorialExpediente
INSERT INTO tblHistorialExpediente (
    idExpedienteOriginal, numeroExpediente, nombreExpediente, descripcion, estado, fechaCreacion, 
    fechaEliminacion, responsableEliminacion, idClienteFK, idEmpleadoFK
)
VALUES 
    (1, 'EXP001', 'Expediente Prueba 1', 'Caso inicial creado', 'abierto', GETDATE(), NULL, NULL, 100006, 1003);


-- Insertar datos en tblParteDemandante
INSERT INTO tblParteDemandante (
    idExpedienteFK, relacionCaso, nombreCompleto, identificacionOficial, fechaNacimiento, domicilio, 
    telefono, correo, representanteLegalNombre, numeroLicencia, representanteLegalTelefono, 
    representanteLegalCorreo
)
VALUES 
    (1, 'Demandante', 'Pedro López', 'ABC123456', '1980-01-01', 'Calle Principal 123', '5555555555', 
    'pedro@example.com', 'Juan Pérez', 'XYZ987654', '5555555555', 'juan.perez@example.com');

-- Insertar datos en tblParteDemandada
INSERT INTO tblParteDemandada (
    idExpedienteFK, relacionCaso, nombreCompleto, identificacionOficial, fechaNacimiento, domicilio, 
    telefono, correo, representanteLegalNombre, representanteLegalCedula, representanteLegalTelefono, 
    representanteLegalCorreo
)
VALUES 
    (1, 'Demandado', 'Laura Martínez', 'DEF789012', '1990-05-15', 'Avenida Secundaria 456', '4444444444', 
    'laura@example.com', 'Carlos López', 'GHI123789', '4444444444', 'carlos.lopez@example.com');

-- Insertar datos en tblTercerosRelacionados
INSERT INTO tblTercerosRelacionados (
    idExpedienteFK, relacionCaso, nombreCompleto, identificacionOficial, fechaNacimiento, domicilio, 
    telefono, correo
)
VALUES 
    (1, 'Testigo', 'Ana Gómez', 'JKL456123', '1985-03-10', 'Calle Tercera 789', '3333333333', 
    'ana.gomez@example.com');



-- INFO POR NUMERO EXPEDIENTE
SELECT 
    idExpediente, 
    numeroExpediente, 
    descripcion, 
    estado, 
    nombreExpediente, 
    anioExpediente
FROM 
    tblExpediente
WHERE 
    numeroExpediente = 'EXP0001';

ALTER TABLE tblExpediente ADD fechaApertura DATE NULL;
ALTER TABLE tblExpediente ADD CONSTRAINT DF_fechaApertura DEFAULT GETDATE() FOR fechaApertura;

SELECT * FROM tblExpediente

UPDATE tblExpediente
SET fechaApertura = GETDATE()
WHERE idExpediente = 1;


-- INFORMACION DE LAS PARTES
SELECT 
    'Demandante' AS tipoParte,
    PD.idParteDemandante AS idParte,
    PD.relacionCaso,
    PD.nombreCompleto,
    PD.identificacionOficial,
    PD.fechaNacimiento,
    PD.domicilio,
    PD.telefono,
    PD.correo,
    PD.representanteLegalNombre,
    PD.numeroLicencia AS representanteLegalLicencia,
    PD.representanteLegalTelefono,
    PD.representanteLegalCorreo
FROM 
    tblParteDemandante PD
WHERE 
    PD.idExpedienteFK = (SELECT idExpediente FROM tblExpediente WHERE numeroExpediente = 'EXP0001')

UNION ALL

SELECT 
    'Demandado' AS tipoParte,
    PDM.idParteDemandada AS idParte,
    PDM.relacionCaso,
    PDM.nombreCompleto,
    PDM.identificacionOficial,
    PDM.fechaNacimiento,
    PDM.domicilio,
    PDM.telefono,
    PDM.correo,
    PDM.representanteLegalNombre,
    PDM.representanteLegalCedula AS representanteLegalLicencia,
    PDM.representanteLegalTelefono,
    PDM.representanteLegalCorreo
FROM 
    tblParteDemandada PDM
WHERE 
    PDM.idExpedienteFK = (SELECT idExpediente FROM tblExpediente WHERE numeroExpediente = 'EXP0001')

UNION ALL

SELECT 
    'Tercero Relacionado' AS tipoParte,
    TR.idTerceroRelacionado AS idParte,
    TR.relacionCaso,
    TR.nombreCompleto,
    TR.identificacionOficial,
    TR.fechaNacimiento,
    TR.domicilio,
    TR.telefono,
    TR.correo,
    NULL AS representanteLegalNombre,
    NULL AS representanteLegalLicencia,
    NULL AS representanteLegalTelefono,
    NULL AS representanteLegalCorreo
FROM 
    tblTercerosRelacionados TR
WHERE 
    TR.idExpedienteFK = (SELECT idExpediente FROM tblExpediente WHERE numeroExpediente = 'EXP0001');

-- INFO DE LAS CITAS
SELECT 
    Citas.idCita,
    Citas.motivo,
    Citas.estado AS estadoCita,
    Cliente.idCliente,
    Cliente.nombreCliente,
    Cliente.aPCliente,
    Expediente.numeroExpediente
FROM 
    tblCita Citas
JOIN 
    tblCliente Cliente ON Citas.idClienteFK = Cliente.idCliente
JOIN 
    tblExpediente Expediente ON Cliente.idCliente = Expediente.idClienteFK
WHERE 
    Expediente.numeroExpediente = 'EXP0001'; -- Reemplaza 'EXP0001' con el número de expediente necesario


SELECT * FROM tblCita