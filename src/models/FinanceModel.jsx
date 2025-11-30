class FinanceModel {
    constructor(
        id = '',
        type = 'income', // 'income' or 'expense'
        amount = 0,
        description = '',
        date = new Date(),
        category = ''
    ) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.date = date;
        this.category = category;
    }
}

export default FinanceModel;