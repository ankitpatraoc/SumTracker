import { TextField, Autocomplete, Box, debounce } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { fixedListParams } from "../../pages/product/list";
import { listContacts } from "../../services/products";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "antd";

// type SearchProps = {
//   loadProducts: (queryParams?: any) => void;
// };

const Search = () => {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContact, setSelectedContact] = useState<any>("");
  const [searchText, setSearchText] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams({});

  useEffect(() => {
    if (!selectedContact || selectedContact === "") {
      loadContacts();
    }
  }, [selectedContact]);

  useEffect(() => {
    const fun = async () => {
      if (searchParams) {
        const search = searchParams.get("search");

        if (search && search.length) {
          // When a search term exists
          await loadContacts({
            search,
          });

          setSelectedContact(search);
        }
      } else {
        setSelectedContact("");
        setSearchText(undefined);
      }
    };

    fun();
  }, [searchParams]);

  const loadContacts = async (queryParams?: Record<string, any>) => {
    let query = queryParams || {};
    setLoading(true);
    try {
      const res = await listContacts({
        query: { ...fixedListParams, ...query },
      });

      setContacts(res.data.results);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const debounceChangeHandler = useMemo(() => {
    return debounce((e: any) => {
      const getApps = async () => {
        try {
          await loadContacts({
            search: e,
          });
        } catch (e) {
          console.log(e);
        }
      };

      getApps();
    }, 500);
  }, []);

  useEffect(() => {
    if (
      selectedContact &&
      selectedContact.length > 1 &&
      (!searchText ||
        (searchText && selectedContact && searchText.title !== selectedContact))
    ) {
      setLoading(true);
      if (error && error.length !== 0) {
        setError("");
      }
      debounceChangeHandler(selectedContact);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact]);

  useEffect(() => {
    if (selectedContact && searchText && searchText.id) {
      setSearchParams((prev) => ({
        ...prev,
        limit: 25,
        offset: 0,
        paginate: true,
        search: searchText.id,
      }));
    } else {
      navigate(``);
    }
  }, [searchText]);

  return (
    <>
      <div
        style={{
          height: "1.5rem",
          width: "30%",
          minWidth: "30rem",
          paddingLeft: "3rem",
        }}
      >
        <Autocomplete
          loading={loading}
          id={"autocomplete"}
          // disableCloseOnSelect={true}
          fullWidth
          sx={{
            height: "1.5rem",
            padding: 0,
          }}
          renderInput={(params) => (
            <TextField
              variant="outlined"
              {...params}
              fullWidth
              sx={{
                ...(error && error !== ""
                  ? { border: "1px solid red", borderRadius: "8px" }
                  : {}),
                padding: "4px",
                height: "1.5rem",
                lineHeight: "0.8rem",
              }}
            />
          )}
          value={searchText}
          onInputChange={(event, newValue) => {
            setSelectedContact(newValue);
            if (error && error !== "") {
              setError("");
            }
            //debounceChangeHandler(newValue)
          }}
          onChange={(event, newValue) => {
            setSearchText(newValue);
            if (error && error !== "") {
              setError("");
            }
          }}
          options={contacts}
          getOptionLabel={(option: any) =>
            `${option.code} - ${option.company_name}` || ""
          }
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{
                "& > img": { mr: 2, flexShrink: 0 },
              }}
              {...props}
              key={`${option.company_name}--${option.id}`}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    color: "#0B0E1E",
                  }}
                >
                  {option.code}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Box
                    sx={{
                      color: "#82868C",
                    }}
                  >{`Company: `}</Box>
                  <Box
                    sx={{
                      color: "#0B0E1E",
                      marginLeft: "0.2rem",
                    }}
                  >{`${option.company_name}`}</Box>
                </Box>
              </Box>
            </Box>
          )}
          freeSolo={true}
        />
      </div>
      <Button
        onClick={() => {
          setSearchParams({});
          setSelectedContact("");
          setSearchText(undefined);
        }}
        disabled={!searchParams || !searchParams.get("search")}
        style={{ height: "100%", marginTop: "0.1rem" }}
      >
        Reset
      </Button>
    </>
  );
};

export default Search;
