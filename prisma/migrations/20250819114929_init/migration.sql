-- CreateTable
CREATE TABLE "public"."Strategy" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StrategyMetadata" (
    "id" UUID NOT NULL,
    "strategy_id" TEXT NOT NULL,
    "company_name" TEXT,
    "website_url" TEXT,
    "product_description" TEXT,
    "product_url" TEXT,
    "additional_info" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrategyMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StrategyMetadata_strategy_id_key" ON "public"."StrategyMetadata"("strategy_id");
