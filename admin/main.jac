import {*} with "./graph.jac";
import {*} with "./question/walkers.jac";

walker init {
 root {
       spawn here --> graph::app_graph; 
    }
}