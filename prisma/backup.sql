--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Cargo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cargo" (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE public."Cargo" OWNER TO postgres;

--
-- Name: Cargo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Cargo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Cargo_id_seq" OWNER TO postgres;

--
-- Name: Cargo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Cargo_id_seq" OWNED BY public."Cargo".id;


--
-- Name: Marca; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Marca" (
    id integer NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public."Marca" OWNER TO postgres;

--
-- Name: Marca_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Marca_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Marca_id_seq" OWNER TO postgres;

--
-- Name: Marca_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Marca_id_seq" OWNED BY public."Marca".id;


--
-- Name: Modelo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Modelo" (
    id integer NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public."Modelo" OWNER TO postgres;

--
-- Name: Modelo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Modelo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Modelo_id_seq" OWNER TO postgres;

--
-- Name: Modelo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Modelo_id_seq" OWNED BY public."Modelo".id;


--
-- Name: Personal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Personal" (
    id integer NOT NULL,
    cedula text NOT NULL,
    nombre text NOT NULL,
    telefono text NOT NULL,
    "statusId" integer NOT NULL,
    "cargoId" integer NOT NULL,
    tag text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Personal" OWNER TO postgres;

--
-- Name: Personal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Personal_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Personal_id_seq" OWNER TO postgres;

--
-- Name: Personal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Personal_id_seq" OWNED BY public."Personal".id;


--
-- Name: Status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Status" (
    id integer NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public."Status" OWNER TO postgres;

--
-- Name: Status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Status_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Status_id_seq" OWNER TO postgres;

--
-- Name: Status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Status_id_seq" OWNED BY public."Status".id;


--
-- Name: Unidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Unidad" (
    id integer NOT NULL,
    "idUnidad" text NOT NULL,
    "marcaId" integer NOT NULL,
    "modeloId" integer NOT NULL,
    transmision text NOT NULL,
    vim text NOT NULL,
    fecha text NOT NULL,
    capacidad text NOT NULL,
    combustible text NOT NULL,
    "statusId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Unidad" OWNER TO postgres;

--
-- Name: Unidad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Unidad_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Unidad_id_seq" OWNER TO postgres;

--
-- Name: Unidad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Unidad_id_seq" OWNED BY public."Unidad".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Cargo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cargo" ALTER COLUMN id SET DEFAULT nextval('public."Cargo_id_seq"'::regclass);


--
-- Name: Marca id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Marca" ALTER COLUMN id SET DEFAULT nextval('public."Marca_id_seq"'::regclass);


--
-- Name: Modelo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Modelo" ALTER COLUMN id SET DEFAULT nextval('public."Modelo_id_seq"'::regclass);


--
-- Name: Personal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Personal" ALTER COLUMN id SET DEFAULT nextval('public."Personal_id_seq"'::regclass);


--
-- Name: Status id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Status" ALTER COLUMN id SET DEFAULT nextval('public."Status_id_seq"'::regclass);


--
-- Name: Unidad id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Unidad" ALTER COLUMN id SET DEFAULT nextval('public."Unidad_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Cargo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cargo" (id, name) FROM stdin;
\.


--
-- Data for Name: Marca; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Marca" (id, nombre) FROM stdin;
1	Si
\.


--
-- Data for Name: Modelo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Modelo" (id, nombre) FROM stdin;
\.


--
-- Data for Name: Personal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Personal" (id, cedula, nombre, telefono, "statusId", "cargoId", tag, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Status" (id, nombre) FROM stdin;
\.


--
-- Data for Name: Unidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Unidad" (id, "idUnidad", "marcaId", "modeloId", transmision, vim, fecha, capacidad, combustible, "statusId", "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (username, email, password, "createdAt", id) FROM stdin;
Renzo Mujica	renzomuj@gmail.com	$2b$10$70N5.drw13RO0llOfc4GcOHX2D.CtRCVPHR2MIGQvx4IQaDyv0mDy	2025-03-21 22:00:33.107	1
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
30938825-b70e-4502-985d-5a07cc1e6b7b	9cebb92601ef8556804783a6850c4bf5a855a52315c5b2d16a7907d9f8387e79	2025-03-21 17:56:43.189794-04	20250314185425_init	\N	\N	2025-03-21 17:56:43.181982-04	1
18834d41-a6f5-4642-b83f-8c4d71e88a92	a952d9fd55102d40b1b97d13a7f3a44a45c904b96ffa6703aefdb85c3b9f1dc4	2025-03-21 17:56:43.202107-04	20250314223647_add_user_table	\N	\N	2025-03-21 17:56:43.190496-04	1
5c84dff1-535a-4ed7-88ef-f169a564efbd	1a1bbd9de5d75e1e937529625e08e76851141615b6e724d8cd6d4fa986a5c49c	2025-03-21 17:56:43.222137-04	20250316011653_init	\N	\N	2025-03-21 17:56:43.202928-04	1
\.


--
-- Name: Cargo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Cargo_id_seq"', 1, false);


--
-- Name: Marca_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Marca_id_seq"', 1, true);


--
-- Name: Modelo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Modelo_id_seq"', 1, false);


--
-- Name: Personal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Personal_id_seq"', 1, false);


--
-- Name: Status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Status_id_seq"', 1, false);


--
-- Name: Unidad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Unidad_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: Cargo Cargo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cargo"
    ADD CONSTRAINT "Cargo_pkey" PRIMARY KEY (id);


--
-- Name: Marca Marca_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Marca"
    ADD CONSTRAINT "Marca_pkey" PRIMARY KEY (id);


--
-- Name: Modelo Modelo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Modelo"
    ADD CONSTRAINT "Modelo_pkey" PRIMARY KEY (id);


--
-- Name: Personal Personal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Personal"
    ADD CONSTRAINT "Personal_pkey" PRIMARY KEY (id);


--
-- Name: Status Status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Status"
    ADD CONSTRAINT "Status_pkey" PRIMARY KEY (id);


--
-- Name: Unidad Unidad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Unidad"
    ADD CONSTRAINT "Unidad_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Marca_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Marca_nombre_key" ON public."Marca" USING btree (nombre);


--
-- Name: Modelo_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Modelo_nombre_key" ON public."Modelo" USING btree (nombre);


--
-- Name: Status_nombre_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Status_nombre_key" ON public."Status" USING btree (nombre);


--
-- Name: Unidad_idUnidad_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Unidad_idUnidad_key" ON public."Unidad" USING btree ("idUnidad");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Personal Personal_cargoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Personal"
    ADD CONSTRAINT "Personal_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES public."Cargo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Personal Personal_statusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Personal"
    ADD CONSTRAINT "Personal_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES public."Status"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Unidad Unidad_marcaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Unidad"
    ADD CONSTRAINT "Unidad_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES public."Marca"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Unidad Unidad_modeloId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Unidad"
    ADD CONSTRAINT "Unidad_modeloId_fkey" FOREIGN KEY ("modeloId") REFERENCES public."Modelo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Unidad Unidad_statusId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Unidad"
    ADD CONSTRAINT "Unidad_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES public."Status"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

