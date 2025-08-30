import { TuneOutlined } from "@mui/icons-material";

import { UIButton } from "@components";

const UIFilterButton = ({ ...otherProps }) => {
  return (
    <UIButton fillable startIcon={<TuneOutlined />} size="medium" sans {...otherProps}>
      Filter
    </UIButton>
  );
};

export default UIFilterButton;
