import os
import pandas as pd
from queue import Queue,LifoQueue,PriorityQueue
import numpy as np
import random
import math
from py2neo import Graph,Node,Relationship
# 连接neo4j数据库，输入地址、用户名、密码
graph = Graph('http://localhost:7474',username='neo4j',password='root')


#定义流程图类,生成一棵树
class process:

    def __init__(self,name,attribute,incoming=[],outgoing=[],parent=[],children=[],useTimes=1):
        self.name = name
        self.attribute = attribute
        self.incoming = incoming
        self.outgoing = outgoing
        self.parent = parent
        self.children =children
        self.useTimes = useTimes

def turnXMLToProcess(XMLData,attribute):
    #get name
    tempName = XMLData[XMLData.find('name="')+len('name="'):]
    name = tempName[:tempName.find('"')]
    #print('name:',name)
    #get Incoming
    incoming = []
    begin=0
    temp_begin = XMLData.find('<incoming>')
    temp_end = XMLData.find('</incoming>')    
    while(temp_begin!=-1):
        incoming.append(XMLData[temp_begin+len('<incoming>'):temp_end])
        begin = temp_end+len('</incoming>')
        temp_begin = XMLData[begin:].find('<incoming>')
        temp_end = XMLData[begin:].find('</incoming>')
        if(temp_begin!=-1):
            temp_begin = temp_begin+begin
            temp_end = temp_end+begin
        #print(begin)
    #get outgoing
    outgoing = []
    begin=0
    temp_begin = XMLData.find('<outgoing>')
    temp_end = XMLData.find('</outgoing>')    
    while(temp_begin!=-1):
        outgoing.append(XMLData[temp_begin+len('<outgoing>'):temp_end])
        begin = temp_end+len('</outgoing>')
        temp_begin = XMLData[begin:].find('<outgoing>')
        temp_end = XMLData[begin:].find('</outgoing>')
        if(temp_begin!=-1):
            temp_begin = temp_begin+begin
            temp_end = temp_end+begin
    '''
    outgoing = []
    begin=0
    temp_begin = XMLData.find('<outgoing>')
    temp_end = XMLData.find('</outgoing>')    
    while(temp_begin!=-1):
        tempOut = XMLData[temp_begin+len('<outgoing>'):temp_end]
        
        tempOut = XMLData[temp_begin:temp_end]
        temp_int_begin = tempOut.find('<outgoing>')
        temp_int_end = tempOut.find('</outgoing>')
        #print(tempOut)
        if(temp_int_begin ==0):
            temp_int_begin = len('<outgoing>')
            temp_begin = temp_begin +len('<outgoing>')
        if(temp_int_end ==-1):
            temp_int_end =len(tempOut)
        else:
            temp_end = temp_end - len('</outgoing>') 
        tempOut = tempOut[temp_int_begin:temp_int_end]
        
        #print(temp_int_begin,temp_int_end)
        outgoing.append(tempOut)
        #print(tempOut)        
        begin = temp_end+len('</outgoing>')        
        temp_begin = XMLData[temp_end:].find('<outgoing>')
        temp_end = XMLData[temp_end:].find('</outgoing>')
        if(temp_begin!=-1):
            temp_begin = temp_begin+begin
            temp_end = temp_end+begin
        '''
    return process(name,attribute,incoming,outgoing)

def getProcesses(oneData,classes_names):
    processDataList = []
    for i in range(len(classes_names)):
        name=classes_names[i]
        begin=0
        end = len(oneData)
        newNameBegin='<'+str(name)
        newNameEnd = '</'+str(name)       
        temp_begin = oneData.find(newNameBegin)        
        temp_end = oneData.find(newNameEnd)
        while(temp_begin!=-1):
            oneProcessXMLData = oneData[temp_begin+len(newNameBegin):temp_end]
            processDataList.append(turnXMLToProcess(oneProcessXMLData,name))
            begin= temp_end+len(newNameEnd)
            temp_begin = oneData[begin:].find(newNameBegin)            
            temp_end = oneData[begin:].find(newNameEnd)            
            if(temp_begin!=-1):
                temp_begin=temp_begin+begin
                temp_end = temp_end+begin
            #print('begin:',temp_begin)
    return processDataList

def findRelation(data):   
    relationList = [] 
    for oneData in data:
        tempData =oneData
        outgoing = tempData.outgoing
        subData = findProcess(data,outgoing)
        tempData.children = subData
        for oneSubData in subData:
            relationList.append([tempData.name,oneSubData.name])
        
    return relationList
            
def findProcess(data,outgoings):
    result = []
    for i in range(len(outgoings)):
        oneOutgoing = outgoings[i]
        for j in range(len(data)):
            temp_incomings = data[j].incoming
            for k in range(len(temp_incomings)):
                if(temp_incomings[k]==oneOutgoing):
                    result.append(data[j])
                    break
    return result
            
def read_file():
    path ="C:\\Users\\Administrator\\Desktop\\研究生\\代码\\前台\\vue-bpmn-demo\\static\\tempData"
    fileList = os.listdir(path)
    fileContent = []
    #print(type(fileList[0]))
    for file in fileList:
        oneFile = []
        with open(path+'/'+file) as file_obj:
            content = file_obj.read()
            fileContent.append(content)
    return fileList,fileContent

def analysisData(fileName,fileContent):
    classes_names=['startEvent','endEvent','userTask',
                   'parallelGateway','inclusiveGateway',
                   'exclusiveGateway','serviceTask']

    #排除垃圾数据    
    all_sub_pro = []
    all_data = []
    relationList = []
    for i in range(len(fileContent)):   
        #print("处理了：",i)
        strOneData = fileContent[i]
        processDataList = getProcesses(strOneData,classes_names)
        oneRelation = findRelation(processDataList)
        relationList.append(oneRelation)
        #print(len(relationList))
        all_data.append(processDataList)        
    return all_data,relationList
def findNode(nodeList,name1,name2):
    num1 = -1
    num2 = -1
    for i in range(len(nodeList)):
        if(nodeList[i].name is name1):            
            num1 = i
        if(nodeList[i].name is name2):
            num2 = i
    if(num1*num2<0):
        print('error!')
    return num1,num2
print('正在读取数据……')
#读取BPMN文件。返回文件List
fileName,fileContent=read_file()
print('数据读取完成，正在解析……')
#定义所有的流程图属性
#解析BPMN数据。获取节点集N，以及关系集R
nodeList,relationList = analysisData(fileName,fileContent)
print('数据解析完成')
print('节点和关系生成完成')
for i in range(len(fileName)):
    fileName[i] = (fileName[i])[0:fileName[i].find('.txt')]
#neo4j核心模块

index = 0
graphNodeList = []
#将数据写进neo4j
for index in range(0,len(fileName)):
    print("处理了：",index)
    graphNodeList = []
    #删除老数据
    cmd = "match (n:"+fileName[index]+")  detach delete n"
    graph.run("match (n:haha)  detach delete n")
    #插入新数据
    for oneNode in nodeList[index]:
        temp = Node(fileName[index],name = oneNode.name)
        graph.create(temp)
        graphNodeList.append(temp)

    for oneRelation in relationList[index]:
        num1,num2 = findNode(nodeList[index],oneRelation[0],oneRelation[1])
        #print(graphNodeList[num1],'to',graphNodeList[num2])
        r = Relationship(graphNodeList[num1],'to',graphNodeList[num2])
        graph.create(r)

'''
for oneData in nodeList[0]:
    print(oneData.name,oneData.incoming,oneData.outgoing)
for oneData in relationList[0]:
    print(oneData)
'''

