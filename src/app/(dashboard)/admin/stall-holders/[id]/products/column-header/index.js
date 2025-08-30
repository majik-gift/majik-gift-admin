import { UIIconButton } from "@/shared/components";
import { RemoveRedEye } from "@mui/icons-material";
import { Chip, Tooltip } from "@mui/material";
import Link from "next/link";

const getProductsColumnHeader = [
  {
    minWidth: 120,
    field: "own_by",
    headerName: "Own by",
    sortable: true,
    flex: 1,
    resizable: false,
    renderCell: ({ row }) => {
      return `${row?.created_by?.first_name} ${row?.created_by?.last_name}`;
    },
  },
  {
    minWidth: 120,
    field: "name",
    headerName: "Name",
    sortable: true,
    flex: 1,
    resizable: false,
  },

  {
    minWidth: 120,
    field: "price",
    headerName: "Price",
    sortable: true,
    resizable: false,
    flex: 1,
    valueFormatter: (row) => {
      return `${row} AUD`;
    },
  },
  {
    minWidth: 120,

    field: "registration_status",
    headerName: "Status",
    flex: 1.2,
    sortable: true,
    sortable: false,

    renderCell: (params) => {
      return (
        <Chip
          label={params.value}
          color={params.value === "approved" ? "success" : params.value === "rejected" ? "error" : "warning"}
          size="small"
          sx={{ textTransform: "capitalize" }}
        />
      );
    },
  },

  {
    minWidth: 120,
    field: "action",
    headerName: "Action",
    sortable: true,
    resizable: false,
    flex: 1,
    renderCell: (params) => {
      return (
        <Tooltip title={"View details"}>
          <UIIconButton component={Link} href={`products/${params.id}/details`} size="small" fillable>
            <RemoveRedEye />
          </UIIconButton>
        </Tooltip>
      );
    },
  },
];

export default getProductsColumnHeader;
