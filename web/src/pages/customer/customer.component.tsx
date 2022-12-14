import { ChangeEvent, useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import AddCustomer from "../../components/add-customer/add_customer.component";
import EditCustomer from "../../components/edit-customer/edit_customer.component";
import CustomerRow from "../../components/customer-row/customer_row.component";
import AddCashBookRecord from "../../components/add-cash-book-record/add_cash_book_record.component";
import CashBookHistory from "../../components/cash-book-history/cash_book_history.component";
import CustomPagination from "../../components/custom-pagination/custom_pagination.component";
import SearchBar from "../../components/search-bar/search_bar.component";
import { withEnumGuard } from "../../utils/enum/enum_guard";
import {
  fetchAllCustomerDataStart,
  setCustomerFilter,
  setCustomerPagination,
  setRelationshipFilter,
} from "../../store/customer/customer.action";
import {
  selectCustomerFilter,
  selectCustomerPagination,
  selectCustomerRelationshipFilter,
  selectCustomers,
} from "../../store/customer/customer.selector";
import {
  CustomerData,
  SELECT_CUSTOMER_RELATIONSHIP,
} from "../../store/customer/customer.types";

import styles from "./customer.module.scss";

const Customer = () => {
  const dispatch = useDispatch();
  const customerList = useSelector(selectCustomers);

  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [showAddCashBookRecord, setShowAddCashBookRecord] = useState(false);
  const [showCashBookHistory, setShowCashBookHistory] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerData>();

  // handle relationship filter
  const relationshipFilter = useSelector(selectCustomerRelationshipFilter);
  const handleSelectRelationshipFilter = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const value = withEnumGuard(SELECT_CUSTOMER_RELATIONSHIP).check(
      e.target.value
    )
      ? e.target.value
      : SELECT_CUSTOMER_RELATIONSHIP.ALL;
    dispatch(setRelationshipFilter(value));
  };

  // handle pagination
  const customerPagination = useSelector(selectCustomerPagination);
  const offset = (customerPagination.page - 1) * customerPagination.limit;
  const handlePagination = (page: number) => {
    dispatch(setCustomerPagination(page));
  };

  // handle customer filter
  const customerFilter = useSelector(selectCustomerFilter);
  useEffect(() => {
    dispatch(fetchAllCustomerDataStart());
  }, [customerFilter, customerPagination.page, dispatch]);

  // clean up customer filter on unmount
  useEffect(() => {
    return () => {
      dispatch(setCustomerFilter(""));
    };
  }, [dispatch]);

  return (
    <>
      <Container>
        <div className={styles["customer-header"]}>
          <h1>Customer List - ????????????</h1>
        </div>
        <div className={styles["customer-body"]}>
          <div className={styles["bar"]}>
            <SearchBar
              className={styles["search-bar"]}
              placeholder="Search customer here..."
              onSearch={(criteria) => {
                dispatch(setCustomerFilter(criteria));
                handlePagination(1)
              }}
            />
            <Form.Select
              className={styles["select-relationship"]}
              defaultValue={relationshipFilter}
              onChange={handleSelectRelationshipFilter}
            >
              <option value={SELECT_CUSTOMER_RELATIONSHIP.ALL}>All Data</option>
              <option value={SELECT_CUSTOMER_RELATIONSHIP.IN_COOPERATION}>
                In Coop
              </option>
              <option value={SELECT_CUSTOMER_RELATIONSHIP.SUSPENDED}>
                Suspended
              </option>
            </Form.Select>
            <Button variant="danger" onClick={() => setShowAddCustomer(true)}>
              Add Customer
            </Button>
          </div>
          <Card className="mb-3">
            {customerList.length === 0 ? (
              <h1 className={styles["no-found"]}>
                &#8212; No Customer Found &#8212;
              </h1>
            ) : (
              customerList.map((customer, index) => (
                <CustomerRow
                  key={customer.id}
                  index={offset + index + 1}
                  customer={customer}
                  openEditCustomer={(customer: CustomerData) => {
                    setCurrentCustomer(customer);
                    setShowEditCustomer(true);
                  }}
                  openAddCashBookRecord={(customer: CustomerData) => {
                    setCurrentCustomer(customer);
                    setShowAddCashBookRecord(true);
                  }}
                  openCashBookHistory={(customer: CustomerData) => {
                    setCurrentCustomer(customer);
                    setShowCashBookHistory(true);
                  }}
                />
              ))
            )}
          </Card>
        </div>
        <CustomPagination
          pagination={customerPagination}
          handlePagination={handlePagination}
        />
      </Container>
      <AddCustomer
        show={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
      />
      <EditCustomer
        show={showEditCustomer}
        onClose={() => setShowEditCustomer(false)}
        customer={currentCustomer}
      />
      <AddCashBookRecord
        show={showAddCashBookRecord}
        onClose={() => setShowAddCashBookRecord(false)}
        customer={currentCustomer}
      />
      <CashBookHistory
        show={showCashBookHistory}
        onClose={() => setShowCashBookHistory(false)}
        customer={currentCustomer}
      />
    </>
  );
};

export default Customer;
