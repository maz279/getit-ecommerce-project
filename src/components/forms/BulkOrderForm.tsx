import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Package, Users, Calculator, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface BulkOrderFormData {
  category_id: string;
  product_name: string;
  quantity: number;
  special_requirements?: string;
  expected_delivery_date?: string;
  delivery_address: {
    street: string;
    city: string;
    district: string;
    postal_code: string;
    country: string;
  };
  business_license?: string;
  tax_id?: string;
}

const categories = [
  { id: 'electronics', name: 'Electronics & Technology', name_bn: 'ইলেকট্রনিক্স ও প্রযুক্তি', min_qty: 50 },
  { id: 'fashion', name: 'Fashion & Apparel', name_bn: 'ফ্যাশন ও পোশাক', min_qty: 100 },
  { id: 'home-appliances', name: 'Home Appliances', name_bn: 'গৃহস্থালী সামগ্রী', min_qty: 25 },
  { id: 'food-beverage', name: 'Food & Beverage', name_bn: 'খাদ্য ও পানীয়', min_qty: 200 },
  { id: 'office-supplies', name: 'Office Supplies', name_bn: 'অফিস সামগ্রী', min_qty: 100 },
  { id: 'healthcare', name: 'Healthcare Products', name_bn: 'স্বাস্থ্যসেবা পণ্য', min_qty: 50 }
];

export function BulkOrderForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<BulkOrderFormData>();

  const quantity = watch('quantity');

  const onSubmit = async (data: BulkOrderFormData) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit a bulk order request.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('bulk_order_requests')
        .insert({
          user_id: user.id,
          category_id: data.category_id,
          quantity: data.quantity,
          special_requirements: data.special_requirements,
          expected_delivery_date: data.expected_delivery_date,
          delivery_address: data.delivery_address,
          business_license: data.business_license,
          tax_id: data.tax_id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Bulk Order Request Submitted',
        description: 'We will contact you within 24 hours with a custom quote.',
      });

      reset();
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error submitting bulk order:', error);
      toast({
        title: 'Submission Failed',
        description: 'Please try again or contact support.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category);
    setValue('category_id', categoryId);
  };

  const calculateEstimatedDiscount = () => {
    if (!quantity || !selectedCategory) return 0;
    
    if (quantity >= selectedCategory.min_qty * 10) return 25;
    if (quantity >= selectedCategory.min_qty * 5) return 20;
    if (quantity >= selectedCategory.min_qty * 2) return 15;
    if (quantity >= selectedCategory.min_qty) return 10;
    return 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">বাল্ক অর্ডার রিকুয়েস্ট</h1>
        <p className="text-muted-foreground">
          বড় পরিমাণে অর্ডারের জন্য বিশেষ ছাড় পান
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Benefits Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              বাল্ক অর্ডারের সুবিধা
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calculator className="w-5 h-5 mt-1 text-green-600" />
              <div>
                <h4 className="font-medium">বিশেষ ছাড়</h4>
                <p className="text-sm text-muted-foreground">১০-২৫% পর্যন্ত ছাড়</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 mt-1 text-blue-600" />
              <div>
                <h4 className="font-medium">ডেডিকেটেড সাপোর্ট</h4>
                <p className="text-sm text-muted-foreground">বিশেষ কাস্টমার সার্ভিস</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 mt-1 text-purple-600" />
              <div>
                <h4 className="font-medium">কাস্টম কোটেশন</h4>
                <p className="text-sm text-muted-foreground">আপনার প্রয়োজন অনুযায়ী</p>
              </div>
            </div>

            {selectedCategory && quantity && (
              <div className="p-3 bg-green-50 rounded-lg border">
                <h4 className="font-medium text-green-800">আনুমানিক ছাড়</h4>
                <div className="text-2xl font-bold text-green-600">
                  {calculateEstimatedDiscount()}%
                </div>
                <p className="text-xs text-green-700">
                  {quantity.toLocaleString()} পিস অর্ডারের জন্য
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>বাল্ক অর্ডার ফর্ম</CardTitle>
            <CardDescription>
              নিচের তথ্যগুলো পূরণ করুন। আমরা ২৪ ঘন্টার মধ্যে আপনার সাথে যোগাযোগ করব।
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">পণ্যের ক্যাটেগরি *</Label>
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="ক্যাটেগরি নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex flex-col">
                          <span>{category.name_bn}</span>
                          <span className="text-xs text-muted-foreground">
                            {category.name} (Min: {category.min_qty})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && (
                  <p className="text-sm text-red-500">ক্যাটেগরি নির্বাচন করুন</p>
                )}
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="product_name">পণ্যের নাম *</Label>
                <Input
                  {...register('product_name', { required: 'পণ্যের নাম লিখুন' })}
                  placeholder="যেমন: Samsung Galaxy S24, Cotton T-shirt ইত্যাদি"
                />
                {errors.product_name && (
                  <p className="text-sm text-red-500">{errors.product_name.message}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  পরিমাণ *
                  {selectedCategory && (
                    <Badge variant="outline" className="ml-2">
                      সর্বনিম্ন: {selectedCategory.min_qty}
                    </Badge>
                  )}
                </Label>
                <Input
                  type="number"
                  {...register('quantity', { 
                    required: 'পরিমাণ লিখুন',
                    min: selectedCategory?.min_qty || 1
                  })}
                  placeholder="যেমন: ১০০০"
                />
                {errors.quantity && (
                  <p className="text-sm text-red-500">{errors.quantity.message}</p>
                )}
                {selectedCategory && quantity && quantity < selectedCategory.min_qty && (
                  <Alert>
                    <AlertDescription>
                      এই ক্যাটেগরিতে সর্বনিম্ন {selectedCategory.min_qty} পিস অর্ডার করতে হবে
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Special Requirements */}
              <div className="space-y-2">
                <Label htmlFor="special_requirements">বিশেষ প্রয়োজনীয়তা</Label>
                <Textarea
                  {...register('special_requirements')}
                  placeholder="যেমন: কাস্টম ব্র্যান্ডিং, বিশেষ প্যাকেজিং, ডেলিভারি টাইম ইত্যাদি"
                  rows={3}
                />
              </div>

              {/* Expected Delivery Date */}
              <div className="space-y-2">
                <Label htmlFor="expected_delivery_date">প্রত্যাশিত ডেলিভারি তারিখ</Label>
                <Input
                  type="date"
                  {...register('expected_delivery_date')}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Delivery Address */}
              <div className="space-y-4">
                <Label className="text-base font-medium">ডেলিভারি ঠিকানা *</Label>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="street">রাস্তা/এলাকা *</Label>
                    <Input
                      {...register('delivery_address.street', { required: 'রাস্তার নাম লিখুন' })}
                      placeholder="রাস্তা নং, বাড়ি নং"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">শহর *</Label>
                    <Input
                      {...register('delivery_address.city', { required: 'শহরের নাম লিখুন' })}
                      placeholder="যেমন: ঢাকা"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district">জেলা *</Label>
                    <Input
                      {...register('delivery_address.district', { required: 'জেলার নাম লিখুন' })}
                      placeholder="যেমন: ঢাকা"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">পোস্টাল কোড</Label>
                    <Input
                      {...register('delivery_address.postal_code')}
                      placeholder="যেমন: ১২০০"
                    />
                  </div>
                </div>
                
                <Input
                  {...register('delivery_address.country')}
                  value="Bangladesh"
                  readOnly
                  className="bg-muted"
                />
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <Label className="text-base font-medium">ব্যবসায়িক তথ্য (ঐচ্ছিক)</Label>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="business_license">ব্যবসা লাইসেন্স নম্বর</Label>
                    <Input
                      {...register('business_license')}
                      placeholder="ট্রেড লাইসেন্স নম্বর"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax_id">ট্যাক্স আইডি/টিআইএন</Label>
                    <Input
                      {...register('tax_id')}
                      placeholder="TIN নম্বর"
                    />
                  </div>
                </div>
              </div>

              {!user && (
                <Alert>
                  <AlertDescription>
                    বাল্ক অর্ডার সাবমিট করতে অনুগ্রহ করে লগইন করুন
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting || !user}
              >
                {isSubmitting ? 'সাবমিট করা হচ্ছে...' : 'বাল্ক অর্ডার রিকুয়েস্ট সাবমিট করুন'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}