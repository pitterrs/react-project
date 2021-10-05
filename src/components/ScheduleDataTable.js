import React, { useEffect, useState, useRef } from "react";
//import "../App.css";
import useApi from "./Utils/useApi";
import Paper from "@material-ui/core/Paper";
import { ColumnChooser, Toolbar } from "@devexpress/dx-react-grid-material-ui";
import { PagingState } from "@devexpress/dx-react-grid";
import { IntegratedPaging } from "@devexpress/dx-react-grid";
import {
  TableColumnVisibility,
  SearchState,
  IntegratedFiltering,
  SelectionState,
  IntegratedSelection,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  SearchPanel,
  TableSelection,
  TableEditColumn,
} from "@devexpress/dx-react-grid-bootstrap4";
import "@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css";
import {
  Plugin,
  Template,
  TemplateConnector,
  TemplatePlaceholder,
} from "@devexpress/dx-react-core";
import { EditingState } from "@devexpress/dx-react-grid";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Row,
  Col,
  Label,
  FormGroup, 
  Input,
} from "reactstrap";

const initialValue = {
  purch: "",
};

const ScheduleTable = () => {
  const [values, setValues] = useState(initialValue);
  const [rows, setRows] = useState([]);
  const mountRef = useRef(null);
  const [search, setSearch] = useState("");
  const [search1, setSearch1] = useState("");
  const [load, loadInfo] = useApi({
    debounceDelay: 0,
    url: "/ScheduleLines",
    method: "get",
    params: {
      EBELN: search || undefined,
    },
    onCompleted: (response) => {
      setRows(response.data);
      console.log(response.data);
    },
  });

  useEffect(() => {
    load({
      debounced: mountRef.current,
    });
  }, [search]);

  function onChange(ev) {
    const { name, value } = ev.target;
    setValues({ ...values, [name]: value });
    setSearch1(value);
  }

  function onSubmit(ev) {
    ev.preventDefault();
    setSearch(search1);
  }

  const [columns] = useState([
    { name: "id", title: "Test" },
    { name: "ekorg", title: "Purch.Group" },
    { name: "WERKS", title: "Plant" },
    { name: "PLANT_NAME", title: "Plant Desc." },
    { name: "BERID", title: "MRP Area" },
    { name: "BERTX", title: "MRP Desc." },
    { name: "EKGRP", title: "Purch.group" },
    { name: "EBELN", title: "Purch.Doc." },
    { name: "EBELP", title: "Purch. Item" },
    { name: "CALC_SHIP_DATE", title: "Ship Date" },
  ]);

  const [defaultHiddenColumnNames] = useState(["id", "PLANT_NAME", "BERTX", "CALC_SHIP_DATE"]);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([5, 10, 15]);
  const [searchValue, setSearchState] = useState("");
  const [selection, setSelection] = useState([]);

  function FieldGroup({ id, label, ...props }) {
    return (
      <FormGroup>
        <Label>{label}</Label>
        <Input {...props} />
      </FormGroup>
    );
  }

  const Popup = ({ row, onChange, onApplyChanges, onCancelChanges, open }) => (
    <Modal
      isOpen={open}
      onClose={onCancelChanges}
      aria-labelledby="form-dialog-title"
    >
      <ModalHeader id="form-dialog-title">Employee Details</ModalHeader>
      <ModalBody>
        <Container>
          <Row>
            <Col sm={6} className="px-2">
              <FieldGroup
                name="ekorg"
                label="Purch.Group"
                value={row.ekorg}
                onChange={onChange}
              />
            </Col>
            <Col sm={6} className="px-2">
              <FieldGroup
                name="WERKS"
                label="Plant"
                value={row.WERKS}
                onChange={onChange}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="px-2">
              <FieldGroup
                name="BERID"
                label="MRP Area"
                value={row.BERID}
                onChange={onChange}
              />
            </Col>
            <Col sm={6} className="px-2">
              <FieldGroup
                name="EKGRP"
                label="Purch.group"
                value={row.EKGRP}
                onChange={onChange}
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="px-2">
              <FieldGroup
                name="EBENN"
                label="Purch.Doc."
                value={row.EBELN}
                onChange={onChange}
              />
            </Col>
            <Col sm={6} className="px-2">
              <FieldGroup
                name="EBELP"
                label="Purch. Item"
                value={row.EBELP}
                onChange={onChange}
              />
            </Col>
          </Row>
        </Container>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onCancelChanges} color="secondary">
          Cancel
        </Button>{" "}
        <Button onClick={onApplyChanges} color="primary">
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );

  const PopupEditing = React.memo(({ popupComponent: Popup }) => (
    <Plugin>
      <Template name="popupEditing">
        <TemplateConnector>
          {(
            {
              rows,
              getRowId,
              addedRows,
              editingRowIds,
              createRowChange,
              rowChanges,
            },
            {
              changeRow,
              changeAddedRow,
              commitChangedRows,
              commitAddedRows,
              stopEditRows,
              cancelAddedRows,
              cancelChangedRows,
            }
          ) => {
            const isNew = addedRows.length > 0;
            let editedRow;
            let rowId;
            if (isNew) {
              rowId = 0;
              editedRow = addedRows[rowId];
            } else {
              [rowId] = editingRowIds;
              const targetRow = rows.filter(
                (row) => getRowId(row) === rowId
              )[0];
              editedRow = { ...targetRow, ...rowChanges[rowId] };
            }

            const processValueChange = ({ target: { name, value } }) => {
              const changeArgs = {
                rowId,
                change: createRowChange(editedRow, value, name),
              };
              if (isNew) {
                changeAddedRow(changeArgs);
              } else {
                changeRow(changeArgs);
              }
            };
            const rowIds = isNew ? [0] : editingRowIds;
            const applyChanges = () => {
              if (isNew) {
                commitAddedRows({ rowIds });
              } else {
                stopEditRows({ rowIds });
                commitChangedRows({ rowIds });
              }
            };
            const cancelChanges = () => {
              if (isNew) {
                cancelAddedRows({ rowIds });
              } else {
                stopEditRows({ rowIds });
                cancelChangedRows({ rowIds });
              }
            };

            const open = editingRowIds.length > 0 || isNew;
            return (
              <Popup
                open={open}
                row={editedRow}
                onChange={processValueChange}
                onApplyChanges={applyChanges}
                onCancelChanges={cancelChanges}
              />
            );
          }}
        </TemplateConnector>
      </Template>
      <Template name="root">
        <TemplatePlaceholder />
        <TemplatePlaceholder name="popupEditing" />
      </Template>
    </Plugin>
  ));

  const getRowId = (row) => row.id;

  const commitChanges = ({ added, changed }) => {
    let changedRows;
    if (added) {
      const startingAddedId =
        rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];
    }
    if (changed) {
      changedRows = rows.map((row) =>
        changed[row.id] ? { ...row, ...changed[row.id] } : row
      );
    }
    setRows(changedRows);
  };

  return (
    <div className="container">
      <span>Total rows selected: {selection.length}</span>
      <Paper>
        <Grid rows={rows} columns={columns} getRowId={getRowId}>
          <EditingState onCommitChanges={commitChanges} />
          <SearchState value={searchValue} onValueChange={setSearchState} />
          <IntegratedFiltering />
          <SelectionState
            selection={selection}
            onSelectionChange={setSelection}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
          <IntegratedSelection />
          <IntegratedPaging />
          <Table />
          <TableHeaderRow />
          <TableEditColumn showAddCommand showEditCommand />
          <PopupEditing popupComponent={Popup} />
          <TableSelection showSelectAll />
          <TableColumnVisibility
            defaultHiddenColumnNames={defaultHiddenColumnNames}
          />
          <Toolbar />
          <SearchPanel />
          <ColumnChooser />
          <PagingPanel pageSizes={pageSizes} />
        </Grid>
      </Paper>
    </div>
  );
};

export default ScheduleTable;
