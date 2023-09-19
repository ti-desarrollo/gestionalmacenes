CREATE TABLE documentos_solicitud(
    ds_id INT IDENTITY UNIQUE,
    ds_solicitud NVARCHAR(255),
    ds_documento NVARCHAR(255)
);

CREATE TABLE documentos_pedido(
    dp_id INT IDENTITY UNIQUE,
    dp_pedido NVARCHAR(255),
    dp_documento NVARCHAR(255)
);

CREATE TABLE [dbo].[recepcion_pedido_cabecera](
	[rpc_id] [int] IDENTITY(1,1) NOT NULL,
	[rpc_pedido] [int] NOT NULL,
	[rpc_fecha_recepcion] [datetime] NULL,
	[rpc_conformidad] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[rpc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[recepcion_pedido_cabecera] ADD  DEFAULT (getdate()) FOR [rpc_fecha_recepcion]
GO

CREATE TABLE [dbo].[recepcion_pedido_detalle](
	[rpd_id] [int] IDENTITY(1,1) NOT NULL,
	[rpd_rpc] [int] NOT NULL,
	[rpd_item] [nvarchar](10) NOT NULL,
	[rpd_descripcion] [nvarchar](255) NOT NULL,
	[rpd_cantidad_pedida] [decimal](9, 2) NOT NULL,
	[rpd_cantidad_recibida] [decimal](9, 2) NOT NULL,
	[rpd_cantidad_pendiente_recepcionada] [decimal](9, 2) NOT NULL,
	[rpd_fecha] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[rpd_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[recepcion_pedido_detalle] ADD  DEFAULT (getdate()) FOR [rpd_fecha]
GO