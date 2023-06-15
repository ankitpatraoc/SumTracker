import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ResultString from "../../../components/content/result.content";
import Heading from "../../../components/heading/basic.heading";
import Pagination from "../../../components/pagination/basic.pagination";
import Search from "../../../components/search/search.heading";
import { PAGINATION_LIMIT } from "../../../constants/app.constants";
import { PaginateDataType, UrlType } from "../../../interface/common";
import { listProducts } from "../../../services/products";
import { getQueryFromUrl } from "../../../utils/common.utils";
import ProductsTable from "./components/products.table";

export const fixedListParams = {
  paginate: true,
};

const ProductList: FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoding] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams({});

  const getPaginationObject = () => {
    const offset = searchParams.get("offset");
    const limit = searchParams.get("limit");

    return {
      // search: contact,
      offset: offset ? Number(offset) : null,
      limit: limit ? Number(limit) : PAGINATION_LIMIT,
    };
  };

  const [pagination, setPagination] = useState<PaginateDataType>({
    next: null,
    prev: null,
    count: null,
    resultsCount: 0,
    hasOffset: true,
    ...getPaginationObject(),
  });

  useEffect(() => {
    if (searchParams) {
      const search = searchParams.get("search");
      if (search) {
        const offset = searchParams.get("offset");
        const limit = searchParams.get("limit");

        // When a search term exists
        loadProducts({
          search,
          offset,
          limit,
        });
      } else {
        // When no search term exists
        loadProducts();
      }
    }
  }, [searchParams]);

  const loadProducts = async (queryParams?: Record<string, any>) => {
    let query = queryParams || {};
    setLoding(true);
    try {
      const res = await listProducts({
        query: { ...fixedListParams, ...query },
      });

      setProducts(res.data.results);
      setPagination((prev) => {
        return {
          ...prev,
          next: res.data.next,
          prev: res.data.previous,
          count: res.data.count,
          resultsCount: res.data.results.length,
          offset: query?.offset ? Number(query.offset) : null,
        };
      });
    } catch (err) {
      console.log(err);
    }
    setLoding(false);
  };

  const handleNext = (next: UrlType) => {
    if (next === null) {
      return;
    }
    let query = getQueryFromUrl(next);
    setSearchParams((prev) => ({
      ...prev,
      ...query,
    }));
    loadProducts(query);
  };

  const handlePrev = (prev: UrlType) => {
    if (prev === null) {
      return;
    }
    let query = getQueryFromUrl(prev);
    setSearchParams((prev) => ({
      ...prev,
      ...query,
    }));
    loadProducts(query);
  };
  return (
    <>
      <div
        style={{
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: "3.7rem",
        }}
      >
        <Heading titleLevel={2}>Products</Heading>
        <div
          style={{
            width: "40%",
            minWidth: "35rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Search />
        </div>
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: "0.5rem",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <ResultString
                loading={loading}
                pagination={pagination}
                pageString={"product"}
              />
            </div>
            <div>
              <Pagination
                next={pagination.next}
                prev={pagination.prev}
                onNextClick={handleNext}
                onPrevClick={handlePrev}
              />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <ProductsTable list={products} loading={loading} />
        </div>
        <div>
          <Pagination next={pagination.next} prev={pagination.prev} />
        </div>
      </div>
    </>
  );
};

export default ProductList;
