import { supabase } from "../config/supabaseClient.js";

export const getAllCustomers = async () => {
  const { data, error } = await supabase
    .from("customer")
    .select("*")
    .order("id", { ascending: false });
    if (error) throw error;
    return data;
};

export const addCustomers = async (newCustomer) => {
    const {data, error} = await supabase
        .from("customer")
        .insert([{
            name:newCustomer.name,
            facebook_name:newCustomer.facebook_name,
            business_name:newCustomer.business_name,
            address:newCustomer.address,
            email:newCustomer.email,
            contactno:newCustomer.contactno,
            cus_type:newCustomer.cus_type,
            bankaccount:'00000',
            status:"Active"
        }])
        .select()
        .single();
    if(!data) throw error;
    return data;
}

export const updateCustomer = async (id, updateData) =>{
    const {data, error} = await supabase
        .from("customer")
        .update({
            name:updateData.name,
            facebook_name:updateData.facebook_name,
            business_name:updateData.business_name,
            address:updateData.address,
            email:updateData.email,
            contactno:updateData.contactno,
            cus_type:updateData.cus_type,
            bankaccount:updateData.bankaccount,
            status:updateData.status
        })
        .eq("id", id)
        .select();
    if (error) throw error;
    return data;
};

export const deleteCustomer = async (id) => {
  const { error } = await supabase
    .from("customer")
    .delete()
    .eq("id", id);
  if (error) throw error;
};


export const getCustomerStats = async() =>{
    const { count:totalCustomerCount, error: totalErr}= await supabase
        .from("customer")
        .select("*", {count:"exact", head:true});
    if(totalErr) throw totalCountErr;

    const {count:activeCustomerCount,error: activeErr} = await supabase
        .from("customer")
        .select("*", {count: "exact", head:true})
        .eq("status","Active");

    if (activeErr) throw activeErr;

  // Inactive suppliers
  const { count: inactiveCustomerCount, error: inactiveErr } = await supabase
    .from("customer")
    .select("*", { count: "exact", head: true })
    .eq("status", "Inactive");

  if (inactiveErr) throw inactiveErr;
    console.log("Total:", totalCustomerCount);
    console.log("Active:", activeCustomerCount);
    console.log("Inactive:", inactiveCustomerCount);
  return {
    total: totalCustomerCount,
    active: activeCustomerCount,
    inactive: inactiveCustomerCount,
  };

};