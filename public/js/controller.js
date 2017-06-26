angular.module("invoiceApp", [])
.controller("defaultCtrl", function ($scope) {

    $scope.invoices = [
        { id: 101, customer_id: 1, discount: 0.5, total: 2000},
        { id: 102, customer_id: 1, discount: 0.1, total: 1000},
        { id: 103, customer_id: 2, discount: 0.9, total: 300}
    ]
    
    $scope.customers = [
        { id: 1, name: "Intel", address: "USA", phone: "+1-050-411"},
        { id: 2, name: "Google", address: "Pal-Alto", phone: "+1-050-411"},
        { id: 3, name: "Apple", address: "California", phone: "+1-050-411"}
    ]  

    $scope.products = [
        { id: 201, name: "model X", price: 350},
        { id: 202, name: "model Y", price: 450},
        { id: 203, name: "model S", price: 150}
    ]     

    $scope.invoiceItems = [
        { id: 1001, invoice_id: 101, product_id: 201, quantity: 12},
        { id: 1002, invoice_id: 101, product_id: 202, quantity: 12},
        { id: 1003, invoice_id: 101, product_id: 203, quantity: 12},
        { id: 1004, invoice_id: 102, product_id: 201, quantity: 12},
    ] 

    $scope.initInvoice = function(){
        $scope.invoice = {}
        $scope.selectedCustomer = $scope.customers[0];
        $scope.selectedProduct = $scope.products[0];
        $scope.invoice.id = new Date().getTime();
        $scope.invoice.customer_id = $scope.selectedCustomer.id;
        $scope.invoice.discount = 0;
        $scope.invoice.total = 0;
    }

    $scope.initInvoiceItem = function() {
        $scope.invoiceItem = {}
        $scope.invoiceItem.id = new Date().getTime();
        $scope.invoiceItem.invoice_id = $scope.invoice.id;
        $scope.invoiceItem.product_id = $scope.selectedProduct.id;
        $scope.invoiceItem.quantity = 1;        
    }

    $scope.addInvoice = function (invoice) {
        //angular.isDefined - функция, которая позволяет проверить наличие свойства объекта.
        if (angular.isDefined(invoice) &&
            angular.isDefined(invoice.id) &&
            angular.isDefined(invoice.discount)) {
            $scope.invoices.push({
                id: invoice.id,
                discount: invoice.discount,
                customer_id: invoice.customer_id,
                total: invoice.total
            });
            $scope.initInvoice();
            $scope.initInvoiceItem();
        }
    }

    $scope.changeInput = function (elem) {
        if (elem=='customer') {
            $scope.invoice.customer_id = $scope.selectedCustomer.id;
        } else if (elem=='product') {
            $scope.invoiceItem.product_id = $scope.selectedProduct.id;
            $scope.invoiceItem.quantity = 1;
        }
    }

    $scope.addProduct2Invoice =function(invoiceItem) {
        console.log(invoiceItem);
        if (angular.isDefined(invoiceItem) &&
            angular.isDefined(invoiceItem.id) &&
            angular.isDefined(invoiceItem.invoice_id) &&
            angular.isDefined(invoiceItem.product_id) &&
            angular.isDefined(invoiceItem.quantity)) {
            $scope.invoiceItems.push({
                id: invoiceItem.id,
                invoice_id: invoiceItem.invoice_id,
                product_id: invoiceItem.product_id,
                quantity: invoiceItem.quantity
            });
            $scope.totalCalc();
            $scope.initInvoiceItem();
        }
    }

    $scope.totalCalc = function() {
        let total = $scope.invoiceItems.reduce( (total, elem) => {
            if (elem.invoice_id == $scope.invoice.id) {
                return total + elem.quantity; 
                } else return total;
        }, 0);
        $scope.invoice.total = total;
    }

    $scope.initInvoice();
    $scope.initInvoiceItem();
    $scope.invoice.id = 101; 
    $scope.invoiceItem.invoice_id = 101;
    $scope.totalCalc();
});