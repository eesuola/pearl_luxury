import Order from "../model/order.model.js";
import { AppError } from "../utils/appError.js";


export const createOrder = async (orderData, user) => {
  if (user.role !== "admin") {
    throw new AppError("Only admins can create order", 403);
  }
  return await Order.create({
    data: {
      name: orderData.name,
    },
  });
};

export const updateOrder = async (id, orderData, user) => {
  if (user.role !== "admin") {
    throw new AppError("Only admins can update orders", 403);
  }
  const order = await Order.findById({ where: { id } });
  if (!order) {
    throw new AppError("Order not found", 404);
  }
  return await Order.update({
    where: { id },
    data: {
      name: orderData.name,
    },
  });
};

export const deleteOrder = async (id, user) => {
  if (user.role !== "admin") {
    throw new AppError("Only admins can delete order", 403);
  }
  const order = await Order.findUnique({ where: { id } });
  if (!order) {
    throw new AppError("Order not found", 404);
  }
  return await Order.delete({ where: { id } });
};

export const getAllOrder = async () => {
  return await Order.findMany();
};

export const deleteAllOrder = async (user) => {
  if (user.role !== "admin") {
    throw new AppError("Only admins can delete all orders", 403);
  }
  return await Order.deleteMany();
}