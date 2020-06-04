# ec2-54-166-36-5.compute-1.amazonaws.com
# /register
# 'postgres://postgres:T46750p0mxfkS99TbDoU@database-1.czmvwofht5pq.us-east-1.rds.amazonaws.com:5432/'
curl -X POST --data "username=mra" --data "password=123456" https://ec2-54-166-36-5.compute-1.amazonaws.com/register

curl -X POST --data "username=mra&password=123456" ec2-54-166-36-5.compute-1.amazonaws.com/register

