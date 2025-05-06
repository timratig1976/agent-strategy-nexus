
-- Create procedure to get strategy metadata
CREATE OR REPLACE FUNCTION public.get_strategy_metadata(strategy_id_param UUID)
RETURNS TABLE (
    id UUID,
    strategy_id UUID,
    company_name TEXT,
    website_url TEXT,
    product_description TEXT,
    product_url TEXT,
    additional_info TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.strategy_metadata
    WHERE strategy_id = strategy_id_param;
END;
$$;

-- Create procedure to upsert strategy metadata
CREATE OR REPLACE FUNCTION public.upsert_strategy_metadata(
    strategy_id_param UUID,
    company_name_param TEXT,
    website_url_param TEXT,
    product_description_param TEXT,
    product_url_param TEXT,
    additional_info_param TEXT
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.strategy_metadata (
        strategy_id,
        company_name,
        website_url,
        product_description,
        product_url,
        additional_info,
        updated_at
    )
    VALUES (
        strategy_id_param,
        company_name_param,
        website_url_param,
        product_description_param,
        product_url_param,
        additional_info_param,
        NOW()
    )
    ON CONFLICT (strategy_id)
    DO UPDATE SET
        company_name = company_name_param,
        website_url = website_url_param,
        product_description = product_description_param,
        product_url = product_url_param,
        additional_info = additional_info_param,
        updated_at = NOW();
END;
$$;
