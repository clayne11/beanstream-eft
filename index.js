import parseArgs from 'minimist';
import * as service from './service';

(async function() {
  const {batchId} = parseArgs(process.argv.slice(2));

  if (!batchId) {
    console.log('--- creating payment ---');
    const batchResponse = await service.makePayment({
      bankNumber: '003',
      transitNumber: '41231',
      accountNumber: '1231242342345',
      amountCents: 150000,
      recipientName: 'David Mattemy',
      customerCode: '123124152512515345345',
      referenceNumber: Date.now(),
    });
    console.log(batchResponse);
    console.log();
    const {batch_id} = batchResponse;
    console.log(await service.getReport(batch_id));
    return;
  }

  console.log('--- fetching report ---');
  console.log(await service.getReport(batchId));
})();
