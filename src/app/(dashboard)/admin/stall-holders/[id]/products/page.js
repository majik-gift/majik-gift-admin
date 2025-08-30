"use client";

import useDataTable from "@/hooks/useDataTable";
import { UICard } from "@/shared/components";
import UITable from "@/shared/components/ui/table";
import { getProducts } from "@/store/products/products.thunk";
import { useParams } from "next/navigation";
import GetProductActions from "./actions/get-product-actions";
import getProductsColumnHeader from "./column-header";

const Products = () => {
  const { id } = useParams();
  const { tableProps, fetching, fetchTableData, setExtraParams } = useDataTable({
    tableApi: getProducts, // Your Redux asyncThunk or API function
    serverPagination: true,
    initialExtraParams: {
      registration_status: "",
      search: "",
    },
    fetchWithDefaultParams: {
      userId: [id],
    },
  });

  return (
    <div>
      <UICard pageHeight heading={"Products"} backButton>
        <GetProductActions fetchTableData={fetchTableData} setExtraParams={setExtraParams} />
        <UITable tableData={fetching.list} loading={fetching.loading} tableColumns={getProductsColumnHeader} {...tableProps} />
      </UICard>
    </div>
  );
};

export default Products;
