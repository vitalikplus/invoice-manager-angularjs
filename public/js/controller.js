angular.module("invoiceApp", [])
.controller("defaultCtrl", function ($scope,  $http) {

    $scope.getCustomers = function () {
        $http.get("http://localhost:8000/api/customers/").then( 
            (response) => {
                $scope.customers = response.data;
        }, (response) => {
                console.log(response.statusText)
        })                
    }

    $scope.getInvoices = function () {
        $http.get("http://localhost:8000/api/invoices/").then( 
            (response) => {
                $scope.invoices = response.data;
                $scope.invoices.map( (elem)=> {
                    elem.customer_name  = $scope.matchCustomerNameById(elem.customer_id);
                }); 
        }, (response) => {
                console.log(response.statusText)
        })                
    } 

    $scope.getProducts = function () {
        $http.get("http://localhost:8000/api/products/").then( 
            (response) => {
                $scope.products = response.data;
        }, (response) => {
                console.log(response.statusText)
        })                
    }

    $scope.getInvoiceItems = function (invoice_id) {
        $http.get("http://localhost:8000/api/invoices/" + invoice_id + '/items').then( 
            (response) => {
                $scope.invoiceItems = response.data;
        }, (response) => {
                console.log(response.statusText)
        })                
    } 

    $scope.postNewInvoice = function (newInvoice) {
        $http.post("http://localhost:8000/api/invoices/", newInvoice).then( 
            (response) => {
                $scope.invoice = response.data;
                  $scope.invoiceItem.invoice_id = $scope.invoice.id;
        }, (response) => {
                console.log(response.statusText)
        })                
    }    

    $scope.putUpdatedInvoice = function (updatedInvoice) {
        $http.put("http://localhost:8000/api/invoices/" + updatedInvoice.id, updatedInvoice).then( 
            (response) => {
                $scope.invoice = response.data;
                $scope.invoice.customer_name = $scope.matchCustomerNameById( $scope.invoice.customer_id );
                let index = $scope.invoices.findIndex( (elem)=> { return elem.id == $scope.invoice.id} );                 
                $scope.invoices[index] = $scope.invoice;
        }, (response) => {
                console.log(response.statusText)
        })                
    }  

    $scope.postNewInvoiceItem = function (invoiceItem) {
        $http.post("http://localhost:8000/api/invoices/" + invoiceItem.invoice_id + "/items", invoiceItem).then( 
            (response) => {
                let responseItem = response.data;
                responseItem.product_name = $scope.matchProductNameById(responseItem.product_id);
                responseItem.product_price = $scope.matchProductPriceById(responseItem.product_id);
                $scope.invoiceItems.push(responseItem);
                $scope.totalCalc(); 
                $scope.putUpdatedInvoice($scope.invoice);
        }, (response) => {
                console.log(response.statusText)
        })                
    }

    $scope.invoiceItems = [  //invoice items in the current invoice 
    ] 

    $scope.invoice = {} //current invoice
    $scope.invoiceItem = {}; //current Invoice item
    $scope.selectedCustomer = {}; //current Customer
    $scope.selectedProduct = {}; //current Product  

    $scope.formDisabled = true;

    $scope.initInvoice = function(){
        $scope.invoice = {}
        if ($scope.customers[0]) $scope.selectedCustomer = $scope.customers[0];
        if ($scope.products[0]) $scope.selectedProduct = $scope.products[0];
        if ($scope.selectedCustomer.id) $scope.invoice.customer_id = $scope.selectedCustomer.id;
        $scope.invoice.customer_name = $scope.selectedCustomer.name;
        $scope.invoice.discount = 0;
        $scope.invoice.total = 0;
    }

    $scope.initInvoiceItem = function() {
        $scope.invoiceItem = {}
        $scope.invoiceItem.invoice_id = $scope.invoice.id;
        $scope.invoiceItem.product_id = $scope.selectedProduct.id;
        $scope.invoiceItem.product_name = $scope.selectedProduct.name; //extra field
        $scope.invoiceItem.product_price = $scope.selectedProduct.price; //extra field
        $scope.invoiceItem.quantity = 1;        
    }

    $scope.newInvoice = function () {
            $scope.initInvoice();
            let invoice = $scope.invoice;
            $scope.initInvoiceItem();
            $scope.formDisabled = false;
        if ( angular.isDefined(invoice) ) {
            $scope.postNewInvoice(invoice);
            $scope.getInvoices(); 
        }
    }

    $scope.changeInput = function (elem) {
        if (elem=='customer') {
            $scope.invoice.customer_id = $scope.selectedCustomer.id;
            $scope.invoice.customer_name = $scope.selectedCustomer.name;
            $scope.putUpdatedInvoice( $scope.invoice );
        } else if (elem=='product') {
            $scope.invoiceItem.product_id = $scope.selectedProduct.id;
            $scope.invoiceItem.product_name = $scope.selectedProduct.name;
            $scope.invoiceItem.product_price = $scope.selectedProduct.price;
            $scope.invoiceItem.quantity = 1;
        } else if (elem=='discount') {
            $scope.totalCalc();
            $scope.putUpdatedInvoice( $scope.invoice );
        }
    }

    $scope.addProduct2Invoice =function(invoiceItem) {
        if (angular.isDefined(invoiceItem) &&
            angular.isDefined(invoiceItem.invoice_id) &&
            angular.isDefined(invoiceItem.product_id) &&
            angular.isDefined(invoiceItem.quantity)) {
            $scope.postNewInvoiceItem(invoiceItem);
            $scope.initInvoiceItem();
        }
    }

    $scope.totalCalc = function() {
        let total = $scope.invoiceItems.reduce( (total, elem) => {
            if (elem.invoice_id == $scope.invoice.id) {
                // return total + elem.product_price * elem.quantity; 
                return total + elem.product_price * elem.quantity; 
                } else return total;
        }, 0);
        $scope.invoice.total = (total * ( 1 - $scope.invoice.discount )).toFixed(2);;
    }

    $scope.matchCustomerNameById = function(id) {
        let index = $scope.customers.findIndex( (elem) => { return elem.id == id } );
        return  $scope.customers[index].name 
    }

    $scope.matchProductNameById = function(id) {
        let index = $scope.products.findIndex( (elem) => { return elem.id == id } );
        return  $scope.products[index].name; 
    }    

    $scope.matchProductPriceById = function(id) {
        let index = $scope.products.findIndex( (elem) => { return elem.id == id } );
        return  $scope.products[index].price; 
    }      

    $scope.getCustomers();
    $scope.getInvoices();
    $scope.getProducts();

})