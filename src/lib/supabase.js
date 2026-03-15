import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://market01.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcmtldDAxIiwicm9sZSI6ImFub24iLCJpbnNlcnZjb25zdW1lckNvZGUiOiJKUzBZT05ZdVR5TnhNZVItNDQ0bzZCQTRBZmpEZFciLCJpYXQiOjE3MDk0MTc0MDAsImV4cCI6MjAyNDk5MzQwMH0.N5s2zT7ZlZ8MZ9JW6lqj6YxNpZlZzQz1rYvE9y0z9k8';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch all products
export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch single product
export async function fetchProduct(id) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Create order
export async function createOrder(order) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Create order items
export async function createOrderItems(items) {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .insert(items)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order items:', error);
    throw error;
  }
}

// Get orders by email
export async function getOrdersByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('email', email)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Get products by category
export async function fetchProductsByCategory(category) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('id', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}
