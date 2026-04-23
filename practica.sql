CREATE TABLE aires_acondicionados (
    id SERIAL PRIMARY KEY,
    marca VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    tipo VARCHAR(50), -- Split, Ventana, Central, etc.
    capacidad_btu INT NOT NULL,
    eficiencia_energetica VARCHAR(10), -- Ej: A++, A+
    refrigerante VARCHAR(20), -- Ej: R410A, R32
    fecha_instalacion DATE,
    ubicacion VARCHAR(150), -- Ej: Oficina, Casa, Local
    cliente VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE
);

INSERT INTO aires_acondicionados (
    marca, modelo, tipo, capacidad_btu, eficiencia_energetica,
    refrigerante, fecha_instalacion, ubicacion, cliente, activo
) VALUES (
    'Samsung', 'AR12TXHQASIN', 'Split', 12000, 'A++',
    'R410A', '2025-03-15', 'Oficina', 'Carlos Gómez', TRUE
);