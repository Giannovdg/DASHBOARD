import { NextResponse } from 'next/server';
import { fetchProductData, createProduct, deleteProduct, updateProduct } from '@/lib/api/dashboardService';

export async function GET() {
  try {
    const productData = await fetchProductData();
    return NextResponse.json(productData);
  } catch (error) {
    console.error('Error fetching product data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const productData = await request.json();
    const createdProduct = await createProduct(productData);
    
    if (!createdProduct) {
      throw new Error('Failed to create product');
    }
    
    return NextResponse.json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const productData = await request.json();
    const updatedProduct = await updateProduct(Number(id), productData);
    
    if (!updatedProduct) {
      throw new Error('Failed to update product');
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const success = await deleteProduct(Number(id));
    
    if (!success) {
      throw new Error('Failed to delete product');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 