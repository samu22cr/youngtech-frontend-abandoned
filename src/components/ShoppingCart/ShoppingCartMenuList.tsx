"use client";

import {
  Divider,
  IconButton,
  Link,
  ListItemText,
  ListSubheader,
  MenuList,
  Theme,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import UnanimatedMenuItem from "../helpers/UnanimatedMenuItem";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import { CartMenuDestroyerContext } from "./ShoppingCartMenu";
import { useContext } from "react";
import ShoppingCartMenuItem from "./ShoppingCartMenuItem";
import { MenuUtils as MU } from "../utils";
import { CartItem } from "@/lib/api/cart";
import { Product } from "@/lib/api/product";

type Props = {
  items: CartItem[];
};

function calcTotal(items: CartItem[]): number {
  let total = 0;
  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const prod: Product = item.product;
    let price = prod.price;
    if (prod.discountPercentage > 0) {
      price -= (prod.price / 100) * prod.discountPercentage;
    }
    total += price * item.quantity;
  }
  return total;
}

export default function ShoppingCartMenuList({ items }: Props) {
  const theme: Theme = useTheme();
  const menuDestroyer: MU.MenuDestroyer = useContext(CartMenuDestroyerContext);

  // const totalPrice: string = items
  //   .reduce(
  //     (prev, current) => prev + current.product.price * current.quantity,
  //     0
  //   )
  //   .toFixed(2);
  const totalPrice = calcTotal(items);

  return (
    <MenuList
      subheader={
        <ListSubheader
          color="inherit"
          disableGutters
          component="div"
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <UnanimatedMenuItem>
            <ListItemText>
              <Typography sx={{ fontWeight: 600 }} variant="h6">
                Total: ₡{totalPrice}
              </Typography>
            </ListItemText>
            <Tooltip title="Ir a checkout" placement="right">
              <Link href="/checkout" onClick={menuDestroyer.destroy}>
                <IconButton>
                  <ShoppingCartCheckoutOutlinedIcon fontSize="medium" />
                </IconButton>
              </Link>
            </Tooltip>
          </UnanimatedMenuItem>
        </ListSubheader>
      }
    >
      {items.map((item, index) => (
        <span key={item.id}>
          <ShoppingCartMenuItem
            product={item.product}
            quantity={item.quantity}
          />
          {index < items.length - 1 && <Divider />}
        </span>
      ))}
    </MenuList>
  );
}
