-- 1. TABELA DE USUÁRIOS (O Centro de Tudo)
CREATE TABLE tb_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Nunca salvar senha pura!
    role VARCHAR(20) DEFAULT 'STUDENT', -- Valores: ADMIN, INSTRUCTOR, STUDENT
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE CATEGORIAS (Para organizar a loja)
CREATE TABLE tb_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE CURSOS (O Produto)
CREATE TABLE tb_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL, -- ex: curso-java-spring (para URL bonita)
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    image_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT (Rascunho), PUBLISHED (Publicado), INACTIVE
    category_id UUID REFERENCES tb_categories(id), -- Quem é o pai dessa categoria?
    instructor_id UUID REFERENCES tb_users(id), -- Quem criou?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE MÓDULOS (Capítulos do Curso)
CREATE TABLE tb_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    course_id UUID REFERENCES tb_courses(id) ON DELETE CASCADE, -- Se apagar curso, apaga módulos
    "order" INTEGER DEFAULT 0, -- "order" entre aspas pq é palavra reservada
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABELA DE AULAS (O Conteúdo)
CREATE TABLE tb_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    video_url TEXT NOT NULL, -- Link do Youtube/Vimeo/S3
    description TEXT,
    duration_seconds INTEGER DEFAULT 0, -- Tempo em segundos
    module_id UUID REFERENCES tb_modules(id) ON DELETE CASCADE,
    "order" INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT FALSE, -- Aula grátis de demonstração?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABELA DE MATERIAIS DE APOIO (PDFs, Zip, etc)
CREATE TABLE tb_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(50), -- ex: PDF, ZIP, DOCX
    lesson_id UUID REFERENCES tb_lessons(id) ON DELETE CASCADE
);

-- 7. TABELA DE PEDIDOS (O Carrinho de Compras fechado)
CREATE TABLE tb_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES tb_users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PAID, CANCELED, REFUNDED
    payment_method VARCHAR(50), -- PIX, CREDIT_CARD
    transaction_id VARCHAR(100), -- ID do Gateway de Pagamento
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABELA DE ITENS DO PEDIDO (O que foi comprado no pedido?)
CREATE TABLE tb_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES tb_orders(id) ON DELETE CASCADE,
    course_id UUID REFERENCES tb_courses(id),
    price_at_purchase DECIMAL(10, 2) NOT NULL -- Salva o preço da época, se aumentar depois não muda aqui
);

-- 9. TABELA DE MATRÍCULAS (O Acesso do Aluno)
CREATE TABLE tb_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES tb_users(id),
    course_id UUID REFERENCES tb_courses(id),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, BLOCKED
    expiration_date TIMESTAMP -- Null = Vitalício
);

-- 10. TABELA DE PROGRESSO (Onde o aluno parou?)
CREATE TABLE tb_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES tb_users(id),
    lesson_id UUID REFERENCES tb_lessons(id),
    is_completed BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id) -- Um aluno só pode completar a mesma aula 1 vez no registro
);

-- 11. TABELA DE AVALIAÇÕES (Estrelinhas)
CREATE TABLE tb_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES tb_users(id),
    course_id UUID REFERENCES tb_courses(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. TABELA DE CERTIFICADOS
CREATE TABLE tb_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES tb_users(id),
    course_id UUID REFERENCES tb_courses(id),
    verification_code VARCHAR(100) UNIQUE NOT NULL, -- Código pra validar se é real
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

